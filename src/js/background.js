(function () {
  const colors = {
    background: '#0E0E0E',
    circle: '#141414',
  };
  const circleSizes = {
    small: 0.05,
    medium: 0.07,
    large: 0.1,
  };
  const circleVelocity = 0.1;
  const animationController = createAnimationController(
    document.getElementById('background'),
    colors,
    circleSizes,
    circleVelocity,
    0.5
  );

  function generateRandom(min, max) {
    if (min > max)
      throw new Error(
        'Invalid arguments given. Minimum cannot be greater than the maximum.'
      );
    if (min === max) return min;
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function calculateCircleArea(radius) {
    return Math.PI * radius ** 2;
  }

  function createAnimationController(
    canvas,
    colors,
    sizes,
    velocity,
    backgroundFillRatio
  ) {
    if (backgroundFillRatio > 1 || backgroundFillRatio < 0)
      throw new Error('Background fill ratio should be between 0 and 1');

    const ctx = canvas.getContext('2d');
    let animationFrame;
    let circles = [];
    let opacity = 1;

    function initialzieController() {
      resizeCanvas();
      generateBackground();
    }

    function generateBackground() {
      const elements = [];

      const fillArea =
        canvas.width *
        backgroundFillRatio *
        (canvas.height * backgroundFillRatio);
      let filledArea = 0;

      while (filledArea < fillArea) {
        for (let [size, ratio] of Object.entries(sizes)) {
          const circleArea = calculateCircleArea(canvas.width * ratio);
          if (circleArea + filledArea < fillArea || size === 'small') {
            elements.push(
              createCircle(
                canvas.width,
                canvas.height,
                canvas.width * ratio,
                size
              )
            );
            filledArea += circleArea;
          }
        }
      }

      circles = elements;
    }

    function fixBackgroundOnResize(maxX, maxY, oldWidth, oldHeight) {
      if (!circles || !circles.length) return;

      if (oldWidth && oldHeight) {
        const widthRatio = maxX / oldWidth;
        const heightRatio = maxY / oldHeight;
        circles.forEach((element) => {
          element.x = element.x * widthRatio;
          element.y = element.y * heightRatio;
        });
      }

      circles.forEach((element) => {
        element.radius = maxX * sizes[element.size];
      });
    }

    function createCircle(maxX, maxY, radius, size) {
      return {
        x: generateRandom(radius, maxX - radius),
        y: generateRandom(radius, maxY - radius),
        radius,
        size,
        vx: !!generateRandom(0, 1) ? velocity : -velocity,
        vy: !!generateRandom(0, 1) ? velocity : -velocity,
      };
    }

    function moveBackgroundElements() {
      for (let circle of circles) {
        if (
          circle.x + circle.radius >= canvas.width ||
          circle.x - circle.radius <= 0
        ) {
          circle.x =
            circle.x - circle.radius <= 0
              ? 0 + circle.radius
              : canvas.width - circle.radius;
          circle.vx = -circle.vx;
        }
        if (
          circle.y + circle.radius >= canvas.height ||
          circle.y - circle.radius <= 0
        ) {
          circle.y =
            circle.y - circle.radius <= 0
              ? 0 + circle.radius
              : canvas.height - circle.radius;
          circle.vy = -circle.vy;
        }

        circle.x += circle.vx;
        circle.y += circle.vy;
        drawCircle(circle, colors.circle);
      }
    }

    function clearCanvas() {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function resizeCanvas() {
      const oldWidth = canvas.width;
      const oldHeight = canvas.height;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      return fixBackgroundOnResize(
        window.innerWidth,
        window.innerHeight,
        oldWidth,
        oldHeight
      );
    }

    function shouldUpdate() {
      return opacity > 0;
    }

    function updateOpacity() {
      const aboveTheFoldAreaVisible =
        (window.innerHeight - window.scrollY) / window.innerHeight;
      opacity = aboveTheFoldAreaVisible >= 0 ? aboveTheFoldAreaVisible : 0;
    }

    function drawCircle({ x, y, radius }, color) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    function draw() {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      // If the animation is not in frame, we should not
      // calculate new positions, and draw the circles
      // just clear the canvas and wait for it to be in frame
      if (!shouldUpdate()) {
        clearCanvas();
        animationFrame = window.requestAnimationFrame(draw);
        return;
      }

      clearCanvas();
      moveBackgroundElements();
      animationFrame = window.requestAnimationFrame(draw);
    }

    function resize() {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }

      resizeCanvas();
      draw();
    }

    return {
      initialzieController,
      draw,
      resize,
      updateOpacity,
    };
  }

  animationController.initialzieController();
  window.requestAnimationFrame(animationController.draw);
  window.addEventListener('resize', animationController.resize);
  window.addEventListener('orientationchange', animationController.resize);
  window.addEventListener('scroll', animationController.updateOpacity);
})();
