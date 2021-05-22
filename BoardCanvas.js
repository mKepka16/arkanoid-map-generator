import GridCanvas from './GridCanvas.js';
import SelectionRect from './SelectionRect.js';
import State from './State.js';

class BoardCanvas extends GridCanvas {
  constructor(_canvas, _rows, _cols, _rowHeight, _colWidth) {
    super(_canvas, _rows, _cols, _rowHeight, _colWidth);

    // Background
    this.currentBackground = 5;

    // Selection
    this.selectedBlocks = [];
    this.selectionRect = new SelectionRect('rgba(255, 255, 0, .5)');
    this.displaySelectionRect = false;

    // Mouse
    this.isMouseDown = false;
    this.mouseDownCoords;
    this.lastMouseCoords;
    this.currentMouseCoords;

    // Deletion
    window.addEventListener('keydown', e => this.handleKeyDown(e));

    // Copy
    this.gridIndex = -1;
    this.save();
  }

  saveToFile() {
    const json = JSON.stringify({
      background: this.currentBackground,
      grid: this.grid
    });

    const a = document.createElement('a');
    const file = new Blob([json], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = 'board.json';
    a.click();
  }

  loadFromFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    input.onchange = () => {
      if (!input?.files[0]) return;
      const file = input.files[0];
      const fileReader = new FileReader();
      fileReader.onload = e => this.loadJSON(e);
      fileReader.readAsText(file);
    };
  }

  loadJSON(e) {
    const stringJSON = e.target.result;
    try {
      const boardData = JSON.parse(stringJSON);
      this.selectedBlocks = [];
      this.currentBackground = boardData.background;
      this.grid = boardData.grid;
      this.save();
      State.backgroundChanger.currentBg = boardData.background;
      State.backgroundChanger.setPreviewImage();
    } catch {
      alert('Wrong file format');
    }
  }

  save() {
    if (this.gridIndex != this.getGridLastIndex())
      State.gridHistory.splice(this.gridIndex + 1);

    const gridCopy = this.copyGrid(this.grid);
    State.gridHistory.push(gridCopy);
    const lastIndex = this.getGridLastIndex();
    this.gridIndex++;
  }

  copyGrid(grid) {
    const gridCopy = [];
    grid.forEach(gridRow => {
      const rowCopy = [];
      gridRow.forEach(cell => rowCopy.push({ ...cell }));
      gridCopy.push(rowCopy);
    });

    return gridCopy;
  }

  getGridLastIndex = () => State.gridHistory.length - 1;

  undo() {
    if (this.gridIndex == 0) return;
    this.gridIndex--;
    const previousGrid = this.copyGrid(State.gridHistory[this.gridIndex]);
    this.grid = previousGrid;
  }

  redo() {
    if (this.gridIndex == this.getGridLastIndex()) return;
    this.gridIndex++;
    const nextGrid = this.copyGrid(State.gridHistory[this.gridIndex]);
    this.grid = nextGrid;
  }

  handleKeyDown(e) {
    e.preventDefault();
    if (e.key == 'Delete') return this.fillSelectedCells(null);
    if (!e.ctrlKey && !e.metaKey) return;
    if (e.code == 'KeyZ') return this.undo();
    if (e.code == 'KeyY') return this.redo();
    if (e.code == 'KeyS') return this.saveToFile();
    if (e.code == 'KeyL') return this.loadFromFile();
  }

  handleMouseDown(e) {
    if (e.which != 1) return;
    if (e.shiftKey) this.handleMouseDownWithShift(e);
    else this.handleMouseDownWithoutShift(e);
  }

  handleMouseDownWithoutShift(e) {
    this.mouseDownCoords = this.getMousePosition();
    this.isMouseDown = true;
  }

  handleMouseDownWithShift(e) {
    this.selectionRect.x = this.mouse.x;
    this.selectionRect.y = this.mouse.y;
    this.displaySelectionRect = true;
  }

  handleMouseUp(e) {
    if (e.which != 1) return;
    if (this.displaySelectionRect) return (this.displaySelectionRect = false);

    const { col, row } = this.getMousePosition();
    if (col != this.mouseDownCoords.col || row != this.mouseDownCoords.row)
      return;

    const clickedBlock = this.grid[row][col];
    const clickedBlockIndex = this.selectedBlocks.indexOf(clickedBlock);

    if (!e.ctrlKey && !e.metaKey) this.selectedBlocks = [];
    else if (clickedBlockIndex > -1)
      return this.selectedBlocks.splice(clickedBlockIndex, 1);

    this.selectedBlocks.push(clickedBlock);
  }

  selectCellsInSelectionRect() {
    const topLeft = this.convertCoords(
      this.selectionRect.x,
      this.selectionRect.y
    );
    const bottomRight = this.convertCoords(
      this.selectionRect.x + this.selectionRect.width,
      this.selectionRect.y + this.selectionRect.height
    );

    const fromX = topLeft.col < bottomRight.col ? topLeft.col : bottomRight.col;
    const toX = topLeft.col >= bottomRight.col ? topLeft.col : bottomRight.col;
    const fromY = topLeft.row < bottomRight.row ? topLeft.row : bottomRight.row;
    const toY = topLeft.row >= bottomRight.row ? topLeft.row : bottomRight.row;

    this.selectedBlocks = [];
    for (let x = fromX; x <= toX; x++) {
      for (let y = fromY; y <= toY; y++) {
        const selectedBlock = this.grid[y][x];
        this.selectedBlocks.push(selectedBlock);
      }
    }
  }

  renderSelectionRect() {
    if (!this.displaySelectionRect) return;
    this.selectionRect.width = this.mouse.x - this.selectionRect.x;
    this.selectionRect.height = this.mouse.y - this.selectionRect.y;
    this.ctx.beginPath();
    this.ctx.fillStyle = this.selectionRect.color;
    this.ctx.fillRect(
      this.selectionRect.x,
      this.selectionRect.y,
      this.selectionRect.width,
      this.selectionRect.height
    );
    if (
      this.currentMouseCoords.col != this.lastMouseCoords.col ||
      this.currentMouseCoords.row != this.lastMouseCoords.row
    )
      this.selectCellsInSelectionRect();
  }

  fillSelectedCells(blockId) {
    this.selectedBlocks.forEach(block => (block.blockId = blockId));
    this.save();
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

    //Rendering selected cells
    this.selectedBlocks.forEach(({ x, y }) => {
      this.drawRectangle(x, y, this.selectionColor);
    });

    this.handleHover();
    this.renderSelectionRect();
    this.lastMouseCoords = this.currentMouseCoords;
  }
}

export default BoardCanvas;
