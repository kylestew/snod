/* 
takes a vector 3 of RGB color 
result is in [0-1] range
*/
function luminosity(rgb) {
  return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255.0;
}

export { luminosity };
