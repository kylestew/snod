function rectThatFits(srcRect, dstRect) {
  const [sW, sH] = srcRect;
  const [dW, dH] = dstRect;

  // bound by the greatest size ratio
  if (sW / dW > sH / dH) {
    let scale = sW / dW;
    let height = sH / scale;
    let yOffset = (dH - height) / 2;
    return [0, yOffset, dW, height];
  } else {
    let scale = sH / dH;
    let width = sW / scale;
    let xOffset = (dW - width) / 2;
    return [xOffset, 0, width, dH];
  }
}

function transformThatFits(srcSize, dstRect) {
  const [sW, sH] = srcSize;
  const [dX, dY, dW, dH] = dstRect;

  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/transform

  // bound by the greatest size ratio
  if (sW / dW > sH / dH) {
    let scale = dW / sW;
    let height = sH * scale;
    let yOffset = (dH - height) / 2;
    return [scale, 0, 0, scale, dX, dY + yOffset];
  } else {
    let scale = dH / sH;
    let width = sW * scale;
    let xOffset = (dW - width) / 2;
    return [scale, 0, 0, scale, dX + xOffset, dY];
  }
}

function insetRect(rect, amount) {
  return [
    rect[0] + amount,
    rect[1] + amount,
    rect[2] - amount * 2,
    rect[3] - amount * 2,
  ];
}

function componentToHex(c) {
  if (c === undefined) return 0;
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(rgb) {
  if (rgb.length == 4) {
    let [r, g, b, a] = rgb;
    return (
      "#" +
      componentToHex(r) +
      componentToHex(g) +
      componentToHex(b) +
      componentToHex(a)
    );
  }
  let [r, g, b] = rgb;
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export { rectThatFits, transformThatFits, insetRect, componentToHex, rgbToHex };
