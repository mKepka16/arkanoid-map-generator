import Assets from './Assets.js';
import Canvas from './Canvas.js';
import Cell from './Cell.js';

class GridCanvas extends Canvas {
  constructor(_canvas, _rows, _cols, _rowHeight, _colWidth) {
    super(_canvas, _colWidth * _cols, _rowHeight * _rows);
    this.rows = _rows;
    this.cols = _cols;
    this.rowHeight = _rowHeight;
    this.colWidth = _colWidth;
    this.grid;
    this.initGrid(this.getDefaultCell);
    this.mousePosition;
    this.displayGrid = false;
    this.currentBackground = null;
    this.lineWidth = 2;
    this.selectionColor = '#F04B36';
    this.canvas.onmousedown = e => this.handleMouseDown(e);
    this.canvas.onmouseup = e => this.handleMouseUp(e);
  }

  getMousePosition = () => ({
    col: Math.floor(this.mouse.x / this.colWidth),
    row: Math.floor(this.mouse.y / this.rowHeight)
  });

  convertCoords = (x, y) => ({
    col: Math.floor(x / this.colWidth),
    row: Math.floor(y / this.rowHeight)
  });

  handleMouseDown() {}
  handleMouseUp() {}

  getDefaultCell = (x, y) => ({
    ...new Cell(
      /*Math.random() > 0.7 ? Math.floor(Math.random() * 15) : null*/ null,
      '#fff',
      x,
      y
    )
  });

  initGrid(getDefaultCell) {
    this.grid = [];
    for (let y = 0; y < this.rows; y++) {
      const row = [];
      for (let x = 0; x < this.cols; x++) {
        const cell = getDefaultCell(x, y);
        row.push(cell);
      }
      this.grid.push(row);
    }
  }

  loopThroughGrid(cb) {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        const cell = this.grid[y][x];
        cb(x, y, cell);
      }
    }
  }

  handleHover() {
    if (!this.mouseOnCanvas) return;

    const { col, row } = this.getMousePosition();
    this.drawRectangle(col, row, this.selectionColor, 4);
  }

  update() {
    //Drawing background
    if (this.currentBackground != null)
      this.drawBackground(this.currentBackground);

    //Rendering blocks
    this.loopThroughGrid((x, y, cell) => {
      if (cell.blockId == null) return;
      this.placeBlock(x, y, cell.blockId);
    });

    //Rendering grid
    if (this.displayGrid)
      this.loopThroughGrid((x, y, cell) =>
        this.drawRectangle(x, y, cell.borderColor)
      );

    this.handleHover();
  }

  getCellCoords = (col, row) => ({
    cellX: col * this.colWidth,
    cellY: row * this.rowHeight
  });

  placeBlock(col, row, number) {
    const scale = this.rowHeight / 4;
    const { cellX, cellY } = this.getCellCoords(col, row);
    Assets.renderBlock(this.canvas, number, cellX, cellY, scale);
  }

  drawRectangle(col, row, color = '#ffffff', lineWidth = this.lineWidth) {
    const { cellX, cellY } = this.getCellCoords(col, row);
    this.ctx.beginPath();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(
      cellX + lineWidth / 2,
      cellY + lineWidth / 2,
      this.colWidth - lineWidth,
      this.rowHeight - lineWidth
    );
  }

  drawBackground(number) {
    const scale = this.rowHeight / 4;
    Assets.renderBackground(this.canvas, number, 0, 0, scale);
  }
}

export default GridCanvas;
