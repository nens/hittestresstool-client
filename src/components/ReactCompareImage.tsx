// Copied from react-compare-image and then removed everything to do with showing images
// We only care about 'onSliderPositi

import React, { useEffect, useRef, useState } from 'react';

interface IProps {
  aspectRatio?: 'taller' | 'wider';
  containerCss?: object;
  handle?: React.ReactNode;
  handleSize?: number;
  hover?: boolean;
  leftImageLabel?: string;
  setMapWidth: (width: number) => void;
  onSliderPositionChange?: (position: number) => void;
  rightImageLabel?: string;
  skeleton?: React.ReactNode;
  sliderLineColor?: string;
  sliderLineWidth?: number;
  sliderPositionPercentage?: number;
  vertical?: boolean;
}

const defaultProps = {
  containerCss: {},
  handle: null,
  handleSize: 40,
  hover: false,
  leftImageLabel: null,
  onSliderPositionChange: () => {},
  rightImageLabel: null,
  skeleton: null,
  sliderLineColor: '#ffffff',
  sliderLineWidth: 2,
  sliderPositionPercentage: 0.5,
  vertical: false,
};

const ReactCompareImage: React.FC<IProps> = (props: IProps) => {
  const {
    setMapWidth,
    containerCss,
    handle,
    handleSize = 40,
    hover,
    leftImageLabel,
    onSliderPositionChange,
    rightImageLabel,
    skeleton,
    sliderLineColor,
    sliderLineWidth = 2,
    sliderPositionPercentage = 0.5,
    vertical,
  } = props;

  const horizontal = !vertical;

  // 0 to 1
  const [sliderPosition, setSliderPosition] = useState<number>(
    sliderPositionPercentage,
  );
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isSliding, setIsSliding] = useState<boolean>(false);

  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    const containerPosition = containerRef.current.getBoundingClientRect();
    setContainerHeight(containerPosition.height);
    setContainerWidth(containerPosition.width);
    setMapWidth(containerPosition.width);
  }, [setMapWidth]);

  // make the component responsive
  useEffect(() => {
    const containerElement = containerRef!.current!;
    // @ts-ignore -- ResizeObserver is a browser API Typescript doesn't know
    const resizeObserver = new ResizeObserver(([entry, ..._]) => {
      const containerPosition = entry.target.getBoundingClientRect();
      setContainerWidth(containerPosition.width);
      setContainerHeight(containerPosition.height);
    });
    resizeObserver.observe(containerElement);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const handleSliding = (event: any) => {
      const e = event || window.event;

      // Calc cursor position from the:
      // - left edge of the viewport (for horizontal)
      // - top edge of the viewport (for vertical)
      const cursorXfromViewport = e.touches ? e.touches[0].pageX : e.pageX;
      const cursorYfromViewport = e.touches ? e.touches[0].pageY : e.pageY;

      // Calc Cursor Position from the:
      // - left edge of the window (for horizontal)
      // - top edge of the window (for vertical)
      // to consider any page scrolling
      const cursorXfromWindow = cursorXfromViewport - window.pageXOffset;
      const cursorYfromWindow = cursorYfromViewport - window.pageYOffset;

      // Calc Cursor Position from the:
      // - left edge of the image(for horizontal)
      // - top edge of the image(for vertical)
      // @ts-ignore
      const containerPosition = containerRef!.current!.getBoundingClientRect();
      let pos = horizontal
              ? cursorXfromWindow - containerPosition.left
              : cursorYfromWindow - containerPosition.top;

      // Set minimum and maximum values to prevent the slider from overflowing
      const minPos = 0 + sliderLineWidth / 2;
      const maxPos = horizontal
                   ? containerPosition.width - sliderLineWidth / 2
                   : containerPosition.height - sliderLineWidth / 2;

      if (pos < minPos) pos = minPos;
      if (pos > maxPos) pos = maxPos;

      horizontal ? setSliderPosition(pos / containerPosition.width)
                            : setSliderPosition(pos / containerPosition.height);

      // If there's a callback function, invoke it everytime the slider changes
      if (onSliderPositionChange) {
        horizontal
        ? onSliderPositionChange(pos / containerPosition.width)
        : onSliderPositionChange(pos / containerPosition.height);
      }
    };

    const startSliding = (e: any) => {
      setIsSliding(true);

      // Prevent default behavior other than mobile scrolling
      if (!('touches' in e)) {
        e.preventDefault();
      }

      // Slide the image even if you just click or tap (not drag)
      //handleSliding(e);

      window.addEventListener('mousemove', handleSliding); // 07
      window.addEventListener('touchmove', handleSliding); // 08
    };

    const finishSliding = () => {
      setIsSliding(false);
      window.removeEventListener('mousemove', handleSliding);
      window.removeEventListener('touchmove', handleSliding);
    };

    const sliderElement = sliderRef!.current!;

    // it's necessary to reset event handlers each time the canvasWidth changes

    // for mobile
    // @ts-ignore
    sliderElement.addEventListener('touchstart', startSliding); // 01
    window.addEventListener('touchend', finishSliding); // 02

    // for desktop
    if (hover) {
      // @ts-ignore
      sliderElement.addEventListener('mousemove', handleSliding); // 03
      // @ts-ignore
      sliderElement.addEventListener('mouseleave', finishSliding); // 04
    } else {
      // @ts-ignore
      sliderElement.addEventListener('mousedown', startSliding); // 05
      window.addEventListener('mouseup', finishSliding); // 06
    }

    return () => {
      // cleanup all event resteners
      // @ts-ignore
      sliderElement.removeEventListener('touchstart', startSliding); // 01
      window.removeEventListener('touchend', finishSliding); // 02
      // @ts-ignore
      sliderElement.removeEventListener('mousemove', handleSliding); // 03
      // @ts-ignore
      sliderElement.removeEventListener('mouseleave', finishSliding); // 04
      // @ts-ignore
      sliderElement.removeEventListener('mousedown', startSliding); // 05
      window.removeEventListener('mouseup', finishSliding); // 06
      window.removeEventListener('mousemove', handleSliding); // 07
      window.removeEventListener('touchmove', handleSliding); // 08
    };
    // eslint-disable-next-line
  }, [
    horizontal,
    hover,
    sliderLineWidth,
    vertical,
  ]);

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      boxSizing: 'border-box',
      position: 'absolute',
      width: 'calc(100% - var(--sidebar-width) - 2 * var(--sidebar-padding))',
      margin: 0,
      padding: 0,
      height: '100%',
      top: 0,
      left: 'calc(var(--sidebar-width) + 2 * var(--sidebar-padding))',
      overflow: 'hidden',
      pointerEvents: 'none'
    },
    slider: {
      pointerEvents: 'auto',
      alignItems: 'center',
      cursor:
        (!hover && horizontal && 'ew-resize') ||
        (!hover && !horizontal && 'ns-resize') ||
        undefined
      ,
      display: 'flex',
      flexDirection: horizontal ? 'column' : 'row',
      height: horizontal ? '100%' : `${handleSize}px`,
      justifyContent: 'center',
      left: horizontal
          ? `${containerWidth * sliderPosition - (handleSize||0) / 2}px`
          : 0,
      position: 'absolute',
      top: horizontal
         ? 0
         : `${containerHeight * sliderPosition - (handleSize||0) / 2}px`,
      width: horizontal ? `${handleSize}px` : '100%',
      zIndex: 1000
    },
    line: {
      background: sliderLineColor,
      boxShadow:
        '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
      flex: '0 1 auto',
      height: horizontal ? '100%' : `${sliderLineWidth}px`,
      width: horizontal ? `${sliderLineWidth}px` : '100%',
    },
    handleCustom: {
      alignItems: 'center',
      boxSizing: 'border-box',
      display: 'flex',
      flex: '1 0 auto',
      height: 'auto',
      justifyContent: 'center',
      width: 'auto',
    },
    handleDefault: {
      alignItems: 'center',
      border: `${sliderLineWidth / 2}px solid ${sliderLineColor}`,
      borderRadius: '100%',
      boxShadow:
        '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
      boxSizing: 'border-box',
      display: 'flex',
      flex: '1 0 auto',
      height: `${handleSize}px`,
      justifyContent: 'center',
      width: `${handleSize}px`,
      transform: horizontal ? 'none' : 'rotate(90deg)',
      background: '#318884',
    },
    leftArrow: {
      border: `inset ${handleSize * 0.15}px rgba(0,0,0,0)`,
      borderRight: `${handleSize * 0.15}px solid ${sliderLineColor}`,
      height: '0px',
      marginLeft: `-${handleSize * 0.25}px`, // for IE11
      marginRight: `${handleSize * 0.25}px`,
      width: '0px',
    },
    rightArrow: {
      border: `inset ${handleSize * 0.15}px rgba(0,0,0,0)`,
      borderLeft: `${handleSize * 0.15}px solid ${sliderLineColor}`,
      height: '0px',
      marginRight: `-${handleSize * 0.25}px`, // for IE11
      width: '0px',
    },
    leftLabel: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      left: horizontal ? '5%' : '50%',
      opacity: isSliding ? 0 : 1,
      padding: '10px 20px',
      position: 'absolute',
      top: horizontal ? '50%' : '3%',
      transform: horizontal ? 'translate(0,-50%)' : 'translate(-50%, 0)',
      transition: 'opacity 0.1s ease-out',
    },
    rightLabel: {
      background: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      opacity: isSliding ? 0 : 1,
      padding: '10px 20px',
      position: 'absolute',
      left: horizontal ? undefined : '50%',
      right: horizontal ? '5%' : undefined,
      top: horizontal ? '50%' : undefined,
      bottom: horizontal ? undefined : '3%',
      transform: horizontal ? 'translate(0,-50%)' : 'translate(-50%, 0)',
      transition: 'opacity 0.1s ease-out',
    },
    leftLabelContainer: {
      clip: horizontal
          ? `rect(auto, ${containerWidth * sliderPosition}px, auto, auto)`
          : `rect(auto, auto, ${containerHeight * sliderPosition}px, auto)`,
      height: '100%',
      position: 'absolute',
      width: '100%',
    },
    rightLabelContainer: {
      clip: horizontal
          ? `rect(auto, auto, auto, ${containerWidth * sliderPosition}px)`
          : `rect(${containerHeight * sliderPosition}px, auto, auto, auto)`,
      height: '100%',
      position: 'absolute',
      width: '100%',
    },
  };

  return (
    <>
      {skeleton && (
        <div style={{ ...styles.container }}>{skeleton}</div>
      )}

      <div
        style={{
          ...styles.container,
          ...containerCss
        }}
        ref={containerRef}
        data-testid="container"
      >
        <div style={styles.slider} ref={sliderRef}>
          <div style={styles.line} />
          {handle ? (
            <div style={styles.handleCustom}>{handle}</div>
          ) : (
            <div style={styles.handleDefault}>
              <div style={styles.leftArrow} />
              <div style={styles.rightArrow} />
            </div>
          )}
          <div style={styles.line} />
        </div>
        {/* labels */}
        {leftImageLabel && (
          <div style={styles.leftLabelContainer}>
            <div style={styles.leftLabel}>{leftImageLabel}</div>
          </div>
        )}
        {rightImageLabel && (
          <div style={styles.rightLabelContainer}>
            <div style={styles.rightLabel}>{rightImageLabel}</div>
          </div>
        )}
      </div>
    </>
  );
};

// @ts-ignore
ReactCompareImage.defaultProps = defaultProps;

export default ReactCompareImage;
