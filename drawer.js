function circle(ctx, pos, r, stroke = false, fill = true) {
  ctx.beginPath();
  let [x, y] = pos;
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  if (stroke === true) ctx.stroke();
  if (fill === true) ctx.fill();
}

function line(ctx, a, b) {
  ctx.beginPath();
  let [x, y] = a;
  ctx.moveTo(x, y);
  [x, y] = b;
  ctx.lineTo(x, y);
  ctx.stroke();
}

export { circle, line };
