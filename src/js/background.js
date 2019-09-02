const init = (function backgroundModule() {
  const colors = {
    background: '#0E0E0E',
    circle: '#141414',
  };
  circleVelocity = 0.1;

  const circles = [
    generateCircle(window.innerWidth, window.innerHeight, {
      minRadius: 30,
      maxRadius: 80,
    }),
    generateCircle(window.innerWidth, window.innerHeight, {
      minRadius: 30,
      maxRadius: 80,
    }),
    generateCircle(window.innerWidth, window.innerHeight, {
      minRadius: 30,
      maxRadius: 80,
    }),
    generateCircle(window.innerWidth, window.innerHeight, {
      minRadius: 30,
      maxRadius: 80,
    }),
    generateCircle(window.innerWidth, window.innerHeight, {
      minRadius: 30,
      maxRadius: 80,
    }),
  ];
  const canvasController = createCanvasController(
    document.getElementById('background'),
    colors.background
  );

  function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function createCanvasController(canvas, backgroundColor) {
    if (!canvas)
      throw new Error('No canvas element provided to the controller.');

    return {
      canvas,
      ctx: canvas.getContext('2d'),
      clearCanvas() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillstyle = backgroundColor;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      },
      drawCircle({ x, y, radius }, color) {
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
      },
    };
  }

  function generateCircle(maxX, maxY, { minRadius, maxRadius }) {
    const radius = generateRandom(minRadius, maxRadius);

    return {
      x: generateRandom(radius, maxX - radius),
      y: generateRandom(radius, maxY - radius),
      radius,
      vx: !!generateRandom(0, 1) ? circleVelocity : -circleVelocity,
      vy: !!generateRandom(0, 1) ? circleVelocity : -circleVelocity,
    };
  }

  function draw() {
    canvasController.clearCanvas();
    for (let circle of circles) {
      if (
        circle.x + circle.radius >= window.innerWidth ||
        circle.x - circle.radius <= 0
      ) {
        circle.vx = -circle.vx;
      }
      if (
        circle.y + circle.radius >= window.innerHeight ||
        circle.y - circle.radius <= 0
      ) {
        circle.vy = -circle.vy;
      }

      circle.x += circle.vx;
      circle.y += circle.vy;
      canvasController.drawCircle(circle, colors.circle);
    }
    window.requestAnimationFrame(draw);
  }

  return function() {
    canvasController.resizeCanvas();
    window.requestAnimationFrame(draw);
    window.addEventListener('resize', canvasController.resizeCanvas, false);
  };
})();
