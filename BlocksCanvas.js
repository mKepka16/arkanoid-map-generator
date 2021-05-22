import Cell from './Cell.js';
import GridCanvas from './GridCanvas.js';
import State from './State.js';

class BlocksCanvas extends GridCanvas {
  constructor(_canvas, _rows, _cols, _rowHeight, _colWidth) {
    super(_canvas, _rows, _cols, _rowHeight, _colWidth);
    this.nextBlockToRender = 0;
    this.initGrid(this.getDefaultCell);
    this.lineWidth = 4;
    this.currentMouseCoords;
    this.mouseDownCoords;
    this.isMouseDown = false;
  }

  getDefaultCell = (x, y) => ({
    ...new Cell(this.nextBlockToRender++, '#fff', x, y)
  });

  handleMouseDown() {
    this.mouseDownCoords = this.currentMouseCoords;
    this.isMouseDown = true;
  }

  handleMouseUp() {
    this.isMouseDown = false;
    if (
      this.mouseDownCoords.col != this.currentMouseCoords.col ||
      this.mouseDownCoords.row != this.currentMouseCoords.row
    )
      return;

    const clickedBlock =
      this.grid[this.currentMouseCoords.row][this.currentMouseCoords.col];
    State.boardCanvas.fillSelectedCells(clickedBlock.blockId);
  }

  update() {
    this.currentMouseCoords = this.getMousePosition();
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
}

export default BlocksCanvas;
