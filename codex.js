function acquireGfxCtx() {
  /** @type {HTMLCanvasElement}  */
  const canvas = document.getElementById("canvas0");
  /** @type {CanvasRenderingContext2D} */
  const ctx = canvas.getContext("2d");
  return [canvas, ctx];
}

function fillSpace(
  /** @type {CanvasRenderingContext2D} */
  gfx,
  x,
  y,
  unit,
  color
) {
  gfx.save();
  gfx.fillStyle = color;
  gfx.clearRect(x * unit, y * unit, unit, unit);
  gfx.fillRect(x * unit, y * unit, unit, unit);
  gfx.restore();
}

function changePhase(phase) {

  const { gfx, resolution, coef, colors, unit, center } = phase;

  const sqr = (a) => a * a;

  /* 
    In algorithmic shorthand CIRCLE² is an input section followed by a double loop:

    input corna, cornb
    input side

    for i <-1 to 100
      for j <-1 to 100
        x <- corna + (side * i/100)
        y <- cornb + (side * j/100)
        z <- x² + y²
        c <- int(z)
        if c is even, then plot (i,j)
    
    */

  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {

      const x = center - i;
      const y = center - j;
      const a = sqr(x);
      const b = sqr(y);
      const c = Math.floor(coef * (a + b));
      const d = c % colors.length;
      const color = colors[d];

      fillSpace(
        gfx,
        i,
        j,
        unit,
        color
      );
    }
  }

  phase.coef += phase.speed;
  if (phase.coef >= 0.148) {
    phase.speed = -0.01;
  } else if (phase.coef <= 0.01) {
    phase.speed = 0.01;
  }
}

function codex() {
  const [canvas, gfx] = acquireGfxCtx();
  const unit = 4;
  const resolution = canvas.width / unit;
  const coef = 0.001;
  const colors = ["black", "whitesmoke", "red", "yellow"];
  const center = Math.floor(resolution / 2);
  const speed = 0.001;

  const phase = { gfx, resolution, coef, colors, unit, center, speed };

  const __ = setInterval(changePhase, 99, phase);
}
