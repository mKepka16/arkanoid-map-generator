'use strict';
import Assets from './Assets.js';
import BackgroundChanger from './BackgroundChanger.js';
import BlocksCanvas from './BlocksCanvas.js';
import BoardCanvas from './BoardCanvas.js';
import ContextMenu from './ContextMenu.js';
import GridCheckbox from './GridCheckbox.js';
import State from './State.js';

Assets.loadAssets().then(() => {
  // Board
  const boardCanvasDom = document.querySelector('.boardCanvas');
  const boardCanvas = new BoardCanvas(boardCanvasDom, 28, 14, 28.8, 57.6);
  State.setValue('boardCanvas', boardCanvas);

  // Blocks bar
  const blocksCanvasDom = document.querySelector('.blocksCanvas');
  const blocksCanvas = new BlocksCanvas(blocksCanvasDom, 3, 5, 32, 64);
  State.setValue('blocksCanvas', blocksCanvas);

  // Background changer
  const leftArrow = document.querySelector('.leftArrow');
  const rightArrow = document.querySelector('.rightArrow');
  const preview = document.querySelector('.bgCanvas');
  const backgroundChanger = new BackgroundChanger(
    leftArrow,
    rightArrow,
    preview
  );
  State.setValue('backgroundChanger', backgroundChanger);

  // Grid visibility
  const gridCheckboxDom = document.querySelector('.checkbox__input');
  const gridCheckbox = new GridCheckbox(gridCheckboxDom);
  State.setValue('gridCheckbox', gridCheckbox);

  // Context menu
  const contextMenuDom = document.querySelector('.contextMenu');
  const contextMenu = new ContextMenu(contextMenuDom);
  State.setValue('contextMenu', contextMenu);
});
