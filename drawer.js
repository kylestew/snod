function circle(ctx, pos, r, fill = false, stroke = true) {
  ctx.beginPath();
  let [x, y] = pos;
  ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  if (stroke === true) ctx.stroke();
  if (fill === true) ctx.fill();
}

export { circle };
