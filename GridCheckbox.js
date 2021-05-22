import State from './State.js';

class GridCheckbox {
  constructor(checkbox) {
    checkbox.onclick = e => this.handleClick(e);
  }

  handleClick(e) {
    e.stopPropagation();
    const isChecked = e.target.checked;
    State.boardCanvas.displayGrid = isChecked;
  }
}

export default GridCheckbox;
