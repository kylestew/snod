class ImageSampler {
  constructor(imageData) {
    this.width = imageData.width;
    this.height = imageData.height;
    this.data = imageData.data;
  }

  static CreateFromImageUrl(url, callback) {
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
}

export { ImageSampler };
