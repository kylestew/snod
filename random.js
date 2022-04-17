function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

export { randomInt, randomRange };
