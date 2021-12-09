class ImageSampler {
  constructor(src) {
    this.img = new Image();
    this.img.src = src;
    this.ready = false;
    this.img.onload = () => {
      this.width = this.img.width;
      this.height = this.img.height;
      this.ready = true;

      // create in-memory canvas to get image data
      var canvas = document.createElement("canvas");
      var context = canvas.getContext("2d");
      // var img = document.getElementById('myimg');
      canvas.width = this.img.width;
      canvas.height = this.img.height;
      context.drawImage(this.img, 0, 0);
      this.data = context.getImageData(0, 0, this.img.width, this.img.height);

      console.log(this);
    };
  }

  colorAt(pt) {
    let [x, y] = pt;
    let coord = y * (this.width * 4) + x * 4;
    let data = this.data.data;
    // return [data[coord + 1], data[coord + 2], data[coord + 3], data[coord + 0]];
    return [data[coord + 0], data[coord + 1], data[coord + 2], data[coord + 3]];
  }
}

export { ImageSampler };
