import { polygon } from "@thi.ng/geom";

/* https://github.com/bit101/grid/blob/master/grid.js */

function rectangular(rows, cols, width, height, flipped = false) {
  // create grid of points
  var pts = [];
  const cell_width = width / cols;
  const cell_height = height / rows;
  for (var y = 0; y < rows + 1; ++y) {
    for (var x = 0; x < cols + 1; ++x) {
      pts.push([x * cell_width, y * cell_height]);
    }
  }

  // gather points into polygons
  var polys = [];
  for (var y = 0; y < rows; ++y) {
    for (var x = 0; x < cols; ++x) {
      if (flipped == false) {
        // (0:0, 0:1, 1:0), (1:0, 0:1, 1:1)
        const idx0 = y * cols + x + y;
        const idx1 = (y + 1) * cols + x + (y + 1);
        polys.push(polygon([pts[idx0], pts[idx0 + 1], pts[idx1]]));
        polys.push(polygon([pts[idx1], pts[idx0 + 1], pts[idx1 + 1]]));
      } else {
        // (0:0, 1:1, 0:1), (1:0, 0:1, 1:1)
        const idx0 = y * cols + x + y;
        const idx1 = (y + 1) * cols + x + (y + 1);
        polys.push(polygon([pts[idx0], pts[idx1 + 1], pts[idx1]]));
        polys.push(polygon([pts[idx0], pts[idx0 + 1], pts[idx1 + 1]]));
      }
    }
  }
  return polys;
}

/*
 * Given dimensions to fill and number of cols, a height is determine to
 * make triangles as close to equilateral without having an uneven last row.
 */
function diamond(w, h, cols) {
  console.log("width", w, "height", h, "cols", cols);
  // width is 0.5 less than total columns
  const width = w / (cols - 0.5);
  const heightError = Math.sin(Math.PI / 3) * width; // sin(60) * side
  const rowsError = h / heightError;
  console.log("width", width, "height", heightError, "rows", rowsError);
  const rows = Math.round(rowsError);
  const height = h / rows;
  console.log("width", width, "height", height, "rows", rows);

  let polys = [];
  for (let row = 0; row < rows; row++) {
    let y = row * height;
    let odd = row % 2 != 0;
    let offset = odd ? -width / 2 : 0;
    // let shift = odd ? width / 2 : -width / 2;
    for (let col = 0; col < cols; col++) {
      let x = col * width + offset;

      let A, B, C, D;
      if (odd) {
        A = [x + width / 2, y + height];
        B = [x + width * 1.5, y + height];
        C = [x, y];
        D = [x + width, y];
      } else {
        A = [x, y];
        B = [x + width, y];
        C = [x - width / 2, y + height];
        D = [x + width / 2, y + height];
      }

      polys.push(polygon([A, D, C]));
      polys.push(polygon([D, A, B]));
    }
  }
  return polys;
}

const grids = {
  rectangular,
  diamond,
};

export default grids;
