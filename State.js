class State {
  static boardCanvas;
  static blocksCanvas;
  static backgroundChanger;
  static gridHistory = [];

  static setValue = (key, value) => (this[key] = value);
}

export default State;
