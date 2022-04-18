/* 
takes a vector 3 of RGB colors
input is in [0-255] range
result is in [0-1] range
https://stackoverflow.com/questions/596216/formula-to-determine-perceived-brightness-of-rgb-color
*/
function luminosity(rgb) {
  // return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255.0;
  // Y = 0.299 R + 0.587 G + 0.114 B
  return (0.299 * rgb[0] + 0.587 * rgb[1] + 0.144 * rgb[2]) / 255.0;
}

function hexToRGB(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    var r = parseInt(result[1], 16);
    var g = parseInt(result[2], 16);
    var b = parseInt(result[3], 16);
    return [r, g, b];
  }
  return null;
}

export { luminosity, hexToRGB };
