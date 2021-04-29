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

// // Modelled after below Python functions from Arjan Verkerk

// import json
// # from pylab import bar, clf, plot, savefig

// BUCKET_WIDTH = 0.5


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


// def curve2hist(curve):
//     """
//     For use with curves where the width of each segment covers exactly 1% of
//     the original data, as is the case with API/V4's raster/curve.
//     """
//     percentiles, values = zip(*curve)
//     assert percentiles == tuple(range(len(curve)))

//     hist = {}
//     for i in range(len(values) - 1):
//         for b, p in segment2hist(values[i], values[i + 1]):
//             if b not in hist:
//                 hist[b] = 0
//             hist[b] += p
//     # assert abs(100 - sum(hist.values())) < 0.001
//     return sorted(hist.items())


// with open('curve.json') as f:
//     curve = json.load(f)['results']

// print(curve2hist(curve))

// # # curve
// # x, y = zip(*curve)
// # plot(x, y)
// # savefig('curve.png')

// # # hist
// # clf()
// # hist = curve2hist(curve)
// # b, y = zip(*hist)
// # x = [(x1 + x2) / 2 for x1, x2 in b]
// # bar(x, y, width=BUCKET_WIDTH * 0.8)
// # savefig('bar.png')