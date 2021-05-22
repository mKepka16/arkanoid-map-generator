class Canvas {
  constructor(_canvas, _width, _height) {
    // Globals
    this.canvas = _canvas;
    this.width = _width;
    this.height = _height;

    // Setting canvas
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // FPS Counter
    this.fps = 0;
    this.oldTimeStamp = 0;
    this.deltaTime = 0;

    // Mouse
    this.mouseOnCanvas = false;
    this.canvas.onmousemove = e => this.handleMouseMove(e);
    this.canvas.onmouseenter = () => (this.mouseOnCanvas = true);
    this.canvas.onmouseleave = () => (this.mouseOnCanvas = false);
    this.mouse = {
      x: 0,
      y: 0
    };

    // Starting game loop
    window.requestAnimationFrame(timeStamp => this.frame(timeStamp));
  }

  update() {}

  handleMouseMove(e) {
    const canvasPosition = this.canvas.getBoundingClientRect();
    this.mouse.x = Math.ceil(e.clientX - canvasPosition.x);
    this.mouse.y = Math.ceil(e.clientY - canvasPosition.y);
  }

  frame(timeStamp) {
    this.deltaTime = (timeStamp - this.oldTimeStamp) / 1000;
    this.oldTimeStamp = timeStamp;
    this.fps = Math.round(1 / this.deltaTime);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.update();
    window.requestAnimationFrame(timeStamp => this.frame(timeStamp)); // get next farme
  }
}

export default Canvas;
