const init = (function backgroundModule() {
  const colors = {
    background: '#0E0E0E',
    circle: '#141414',
  };
  const circleVelocity = 0.1;

  // TODO The number and radius of circles should be dynamically set
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
    if (!backgroundColor)
      throw new Error('Please set the color for the background.');

    const ctx = canvas.getContext('2d');
    let opacity = 1;

    return {
      canvas,
      ctx,
      clearCanvas: () => {
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 1;
        ctx.fillstyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      },
      resizeCanvas: () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      },
      updateOpacity: () => {
        const aboveTheFoldAreaVisible =
          (window.innerHeight - window.scrollY) / window.innerHeight;
        opacity = aboveTheFoldAreaVisible >= 0 ? aboveTheFoldAreaVisible : 0;
      },
      drawCircle: ({ x, y, radius }, color) => {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
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
    window.addEventListener('resize', canvasController.resizeCanvas);
    window.addEventListener('orientationchange', canvasController.resizeCanvas);
    window.addEventListener('scroll', canvasController.updateOpacity);
  };
})();
