class Stack {
  constructor() {
    this._stack = {};
    this._size = 0;
  }

  get size() {
    return this._size;
  }

  push(item) {
    this._stack[this._size] = item;
    this._size = this._size + 1;
  }

  pop() {
    if (!this._size) return;

    const item = this._stack[this._size];

    delete this._stack[this._size];

    this._size = this._size - 1;

    return item;
  }
}

module.exports = Stack;
