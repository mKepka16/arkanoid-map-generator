import Assets from './Assets.js';
import State from './State.js';

class BackgroundChanger {
  constructor(leftArrow, rightArrow, preview) {
    leftArrow.onclick = () => this.left();
    rightArrow.onclick = () => this.right();
    this.preview = preview;
    this.ctx = preview.getContext('2d');
    this.currentBg = 0;
    this.backgroundsCount = 7;
    this.scale = 100 / 128;
    this.setPreviewImage();
  }

  setPreviewImage() {
    Assets.renderBackground(this.preview, this.currentBg, 0, 0, this.scale);
    State.boardCanvas.currentBackground = this.currentBg;
  }

  left() {
    this.currentBg--;
    if (this.currentBg < 0) this.currentBg = this.backgroundsCount - 1;
    this.setPreviewImage();
  }

  right() {
    this.currentBg++;
    if (this.currentBg > this.backgroundsCount - 1) this.currentBg = 0;
    this.setPreviewImage();
  }
}

export default BackgroundChanger;
