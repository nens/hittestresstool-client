export const curveApiToHistogram = (curve: [number,number][]) => {
  console.log('curve', curve)
  const histogram:any = []
  for (let i = 0; i < curve.length-1; i += 1 ) {
    const histogramPart = segment2hist(curve[i][1], curve[i+1][1]);
    histogramPart.forEach((item)=>{
      const indexx = item.bucket.start;
      if (!histogram[indexx]) {
        histogram[indexx] = 0;
      }
      histogram[indexx] += item.value;
    })
    
  }
  return histogram;
}

const segment2hist = (a: number, b: number ) => {
  const width = 1;
  let left = (Math.floor(a / width)) * width;
  if (a===b) {
    return [{bucket: {start:left, end:left+width}, value: 1}]
  } 
  let hist: { bucket: {start:number, end:number}, value: number} [] = []
  const distance = b - a;
  while (left < b) {
    const right = left + width;
    const overlap = (Math.min(right, b)) - (Math.max(left, a));
    hist.push({bucket: {start:left, end:right}, value: overlap / distance});
    left += width;
  }
  return hist;
}

// def segment2hist(a, b):
//     """
//     Return histogram data for a 1%-segment of curve data.
//     """
//     width = BUCKET_WIDTH
//     left = (a // width) * width  # floor to nearest bucket edge

//     if a == b:
//         # horizontal in the curve, exactly 1% in the appropriate bucket
//         return [((left, left + width), 1)]

//     # distribute the 1% over appropriate buckets
//     hist = []
//     distance = b - a
//     while left < b:
//         right = left + width
//         overlap = min(right, b) - max(left, a)
//         hist.append(((left, right), overlap / distance))
//         left += width
//     # assert abs(1 - sum(h[1] for h in hist)) < 0.001
//     return hist