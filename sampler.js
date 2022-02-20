import { dist } from "@thi.ng/vectors";
import * as Vibrant from "node-vibrant";
import Values from "values.js";

class ImageSampler {
  constructor(imageData, palette) {
    this.imageData = imageData;
    this.width = imageData.width;
    this.height = imageData.height;
    this.data = imageData.data;
    this.palette = palette;
  }

  static ExpandColorPalette(palette) {
    let expandedPalette = palette
      .flatMap((pal) => {
        const color = new Values(pal);
        return color.all(24);
      })
      .map((value) => value.rgb);

    return expandedPalette;
  }

  static CreateFromImageUrl(url, callback, extractPalette = false) {
    let img = new Image();
    img.src = url;
    img.onload = () => {
      // create in-memory canvas to get image data
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      const data = context.getImageData(0, 0, img.width, img.height);

      if (extractPalette) {
        Vibrant.from(img)
          .quality(1)
          .clearFilters()
          .getPalette((err, palette) => {
            let pal = [
              palette.Vibrant.getHex(),
              palette.LightVibrant.getHex(),
              palette.DarkVibrant.getHex(),
              palette.Muted.getHex(),
              palette.LightMuted.getHex(),
              palette.DarkMuted.getHex(),
            ];
            callback(new ImageSampler(data, this.ExpandColorPalette(pal)));
          });
      }

      callback(new ImageSampler(data));
    };
  }

  colorAt(pt) {
    let [x, y] = pt;
    // clamp coordinates so they always return a value
    x = Math.round(x);
    y = Math.round(y);
    x = x >= this.width ? this.width - 1 : x;
    x = x < 0 ? 0 : x;
    y = y >= this.height ? this.height - 1 : y;
    y = y < 0 ? 0 : y;
    let coord = parseInt(y * (this.width * 4) + x * 4);
    let data = this.data;
    return [data[coord + 0], data[coord + 1], data[coord + 2], data[coord + 3]];
  }

  averageColorCircle(pt, radius = 4) {
    let [x, y] = pt;

    let r = 0;
    let g = 0;
    let b = 0;
    let num = 0;

    // iterate a bounding box in which the circle lies
    for (let i = x - radius; i < x + radius; i++) {
      for (let j = y - radius; j < y + radius; j++) {
        // ensure pixel in sampler
        if (i < 0 || i >= this.width || j < 0 || j >= this.height) continue;

        // ensure pixel in circle
        if (dist(x, y, i, j) > radius) continue;

        let color = this.colorAt([i, j]);
        r += color[0] * color[0];
        g += color[1] * color[1];
        b += color[2] * color[2];
        num++;
      }
    }

    if (num <= 0) {
      return [0, 0, 0, 255];
    }
    return [
      Math.floor(Math.sqrt(r / num)),
      Math.floor(Math.sqrt(g / num)),
      Math.floor(Math.sqrt(b / num)),
      255,
    ];
  }
}

export { ImageSampler };
