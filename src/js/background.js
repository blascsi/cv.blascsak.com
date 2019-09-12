const init = (function backgroundModule() {
  const colors = {
    background: '#0E0E0E',
    circle: '#141414',
  };
  const circleVelocity = 0.1;
  const circleSizes = {
    small: 0.05,
    medium: 0.07,
    large: 0.1,
  };
  let animationFrame;
  let circles = [];
  const canvasController = createCanvasController(
    document.getElementById('background'),
    colors.background
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

  function generateBackground(maxX, maxY, backgroundFillRatio, circleSizes) {
    if (backgroundFillRatio > 1 || backgroundFillRatio < 0)
      throw new Error('Background fill ratio should be between 0 and 1');

    const elements = [];

    const fillArea = maxX * backgroundFillRatio * (maxY * backgroundFillRatio);
    let filledArea = 0;

    while (filledArea < fillArea) {
      for (let [size, ratio] of Object.entries(circleSizes)) {
        const circleArea = calculateCircleArea(maxX * ratio);
        if (circleArea + filledArea < fillArea || size === 'small') {
          elements.push(createCircle(maxX, maxY, maxX * ratio, size));
          filledArea += circleArea;
        }
      }
    }

    return elements;
  }

  // TODO shomehow scatter the circles around the canvas when it is getting bigger
  function fixBackgroundOnResize(
    maxX,
    maxY,
    backgroundElements,
    oldWidth,
    oldHeight
  ) {
    if (!backgroundElements || !backgroundElements.length) return;

    if (oldWidth && oldHeight) {
      const widthRatio = maxX / oldWidth;
      const heightRatio = maxY / oldHeight;
      backgroundElements.forEach(element => {
        element.x = element.x * widthRatio;
        element.y = element.y * heightRatio;
      });
    }

    backgroundElements.forEach(element => {
      element.radius = maxX * circleSizes[element.size];
    });
  }

  function createCircle(maxX, maxY, radius, size) {
    return {
      x: generateRandom(radius, maxX - radius),
      y: generateRandom(radius, maxY - radius),
      radius,
      size,
      vx: !!generateRandom(0, 1) ? circleVelocity : -circleVelocity,
      vy: !!generateRandom(0, 1) ? circleVelocity : -circleVelocity,
    };
  }

  function moveBackgroundElements(maxX, maxY, elements, controller) {
    for (let element of elements) {
      if (
        element.x + element.radius >= maxX ||
        element.x - element.radius <= 0
      ) {
        element.x =
          element.x - element.radius <= 0
            ? 0 + element.radius
            : maxX - element.radius;
        element.vx = -element.vx;
      }
      if (
        element.y + element.radius >= maxY ||
        element.y - element.radius <= 0
      ) {
        element.y =
          element.y - element.radius <= 0
            ? 0 + element.radius
            : maxY - element.radius;
        element.vy = -element.vy;
      }

      element.x += element.vx;
      element.y += element.vy;
      controller.drawCircle(element, colors.circle);
    }
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
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        return fixBackgroundOnResize(
          window.innerWidth,
          window.innerHeight,
          circles,
          oldWidth,
          oldHeight
        );
      },
      shouldUpdate: () => {
        return opacity > 0;
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

  function draw() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }
    // If the animation is not in frame, we should not
    // calculate new positions, and draw the circles
    // just clear the canvas and wait for it to be in frame
    if (!canvasController.shouldUpdate()) {
      canvasController.clearCanvas();
      animationFrame = window.requestAnimationFrame(draw);
      return;
    }

    canvasController.clearCanvas();
    moveBackgroundElements(
      window.innerWidth,
      window.innerHeight,
      circles,
      canvasController
    );
    animationFrame = window.requestAnimationFrame(draw);
  }

  function resize() {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    canvasController.resizeCanvas();
    draw();
  }

  return function init() {
    canvasController.resizeCanvas();
    circles = generateBackground(
      window.innerWidth,
      window.innerHeight,
      0.5,
      circleSizes
    );
    window.requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', resize);
    window.addEventListener('scroll', canvasController.updateOpacity);
  };
})();
