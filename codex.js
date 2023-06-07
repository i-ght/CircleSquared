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
  gfx.clearRect(x, y, unit, unit);
  gfx.fillRect(x, y, unit, unit);
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
        x <- corna + (side Xi/100)
        y <- cornb + (side Xj/100)
        z <- x² + y²
        c <- int(z)
        if c is even, then plot (i,j)
    
    */

  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {

      const x = sqr(i - center);
      const y = sqr(j - center);
      const z = Math.floor(coef * (x + y));

      const color = colors[z % colors.length];

      fillSpace(
        gfx,
        i * unit,
        j * unit,
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
  const [_, gfx] = acquireGfxCtx();
  const resolution = 200;
  const coef = 0.001;
  const colors = ["black", "whitesmoke", "red", "yellow"];
  const unit = 4;
  const center = Math.floor(resolution / 2);
  const speed = 0.001;

  const phase = { gfx, resolution, coef, colors, unit, center, speed };

  const __ = setInterval(changePhase, 99, phase);
}
