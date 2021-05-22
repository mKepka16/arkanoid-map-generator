import State from './State.js';

class ContextMenu {
  constructor(_contextMenu) {
    this.contextMenu = _contextMenu;
    this.undo = document.querySelector('.undo');
    this.redo = document.querySelector('.redo');
    this.delete = document.querySelector('.delete');
    this.saveToFile = document.querySelector('.saveToFile');
    this.loadFromFile = document.querySelector('.loadFromFile');

    this.undo.onclick = e => this.undoAction(e);
    this.redo.onclick = e => this.redoAction(e);
    this.delete.onclick = e => this.deleteAction(e);
    this.saveToFile.onclick = e => this.saveToFileAction(e);
    this.loadFromFile.onclick = e => this.loadFromFileAction(e);
    this.isOpen = false;
    window.addEventListener('click', () => {
      if (this.isOpen) this.closeContextMenu();
    });
    State.boardCanvas.canvas.addEventListener('contextmenu', e =>
      this.handleContextMenu(e)
    );
  }

  handleContextMenu(e) {
    e.preventDefault();
    const x = e.pageX;
    const y = e.pageY;
    this.showContextMenu(x, y);
  }

  showContextMenu(x, y) {
    this.isOpen = true;
    this.contextMenu.style.top = `${y}px`;
    this.contextMenu.style.left = `${x}px`;
    this.contextMenu.style.display = 'block';
  }

  closeContextMenu() {
    this.isOpen = false;
    this.contextMenu.style.display = 'none';
  }

  undoAction() {
    State.boardCanvas.undo();
  }

  redoAction() {
    State.boardCanvas.redo();
  }

  deleteAction() {
    State.boardCanvas.fillSelectedCells(null);
  }

  saveToFileAction() {
    State.boardCanvas.saveToFile();
  }

  loadFromFileAction() {
    State.boardCanvas.loadFromFile();
  }
}

export default ContextMenu;
