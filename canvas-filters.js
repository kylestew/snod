import ndarray from "ndarray";
import lerp from "ndarray-linear-interpolate";
import dtype from "dtype";
import ops from "ndarray-ops";

function invertColors(data) {
  for (var i = 0; i < data.length; i += 4) {
    data[i] = data[i] ^ 255; // Invert Red
    data[i + 1] = data[i + 1] ^ 255; // Invert Green
    data[i + 2] = data[i + 2] ^ 255; // Invert Blue
  }
}

function applyBrightness(data, brightness) {
  for (var i = 0; i < data.length; i += 4) {
    data[i] += 255 * (brightness / 100);
    data[i + 1] += 255 * (brightness / 100);
    data[i + 2] += 255 * (brightness / 100);
  }
}

function truncateColor(value) {
  if (value < 0) {
    value = 0;
  } else if (value > 255) {
    value = 255;
  }
  return value;
}

function applyContrast(data, contrast) {
  var factor = (259.0 * (contrast + 255.0)) / (255.0 * (259.0 - contrast));

  for (var i = 0; i < data.length; i += 4) {
    data[i] = truncateColor(factor * (data[i] - 128.0) + 128.0);
    data[i + 1] = truncateColor(factor * (data[i + 1] - 128.0) + 128.0);
    data[i + 2] = truncateColor(factor * (data[i + 2] - 128.0) + 128.0);
  }
}

function flatten(data) {
  var tmp = new Array(data.length * 3);
  for (var i = 0; i < data.length; i++) {
    tmp[i * 3 + 0] = data[i][0];
    tmp[i * 3 + 1] = data[i][1];
    tmp[i * 3 + 2] = data[i][2];
  }
  return tmp;
}

function applyCubeLUT(dest, src, lut) {
  if (lut.type === "1D") {
    var shape = [lut.size, 3];
  } else {
    // lut.type === '3D'
    var shape = [lut.size, lut.size, lut.size, 3];
  }

  var flat = flatten(lut.data);

  var grid = ndarray(flat, shape);
  var dmin = lut.domain[0];
  var dmax = lut.domain[1];

  for (let y = 0; y < src.shape[1]; y++) {
    for (let x = 0; x < src.shape[0]; x++) {
      var ri = src.get(x, y, 0);
      var gi = src.get(x, y, 1);
      var bi = src.get(x, y, 2);

      // map to domain
      ri = (ri - dmin[0]) / (dmax[0] - dmin[0]);
      gi = (gi - dmin[1]) / (dmax[1] - dmin[1]);
      bi = (bi - dmin[2]) / (dmax[2] - dmin[2]);

      // map to grid units
      ri = ri * (lut.size - 1);
      gi = gi * (lut.size - 1);
      bi = bi * (lut.size - 1);

      // clamp to grid bounds
      ri = ri < 0 ? 0 : ri > lut.size - 1 ? lut.size - 1 : ri;
      gi = gi < 0 ? 0 : gi > lut.size - 1 ? lut.size - 1 : gi;
      bi = bi < 0 ? 0 : bi > lut.size - 1 ? lut.size - 1 : bi;

      if (lut.type === "1D") {
        var ro = lerp(grid, ri, 0);
        var go = lerp(grid, gi, 1);
        var bo = lerp(grid, bi, 2);
      } else {
        // lut.type === '3D'
        // Note `bi` is the fastest changing component
        var ro = lerp(grid, bi, gi, ri, 0);
        var go = lerp(grid, bi, gi, ri, 1);
        var bo = lerp(grid, bi, gi, ri, 2);
      }

      dest.set(x, y, 0, ro);
      dest.set(x, y, 1, go);
      dest.set(x, y, 2, bo);
    }
  }

  return dest;
}

function applyLUT(img, lut) {
  // convert to float32 ndarray
  let data = new (dtype("float32"))(img.data);
  var arr = ndarray(data, [img.width, img.height, 4]);

  // convert RGBA components to 0.0 -> 1.0
  ops.mulseq(arr, 1.0 / 255.0);

  // apply LUT
  applyCubeLUT(arr /* dest */, arr /* src */, lut);

  // convert back to 0.0 -> 255.0
  ops.mulseq(arr, 255.0);

  // ndarray -> ???
  var pixels = new Uint8ClampedArray(arr.data);

  // this entire approach is going to be pretty slow, need to do in place
  for (var i = 0; i < img.data.length; i++) {
    img.data[i] = pixels[i];
  }
}

export { invertColors, applyBrightness, applyContrast, applyLUT };
