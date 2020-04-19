class Queue {
  constructor() {
    this._oldestIndex = undefined;
    this._newestIndex = undefined;
    this._queue = {};
  }

  get length() {
    if (this._oldestIndex === undefined || this._newestIndex === undefined) return 0;

    return this._newestIndex - this._oldestIndex + 1;
  }

  enqueue(item) {
    if (!this.length) {
      this._oldestIndex = 0;
      this._newestIndex = 0;
    } else {
      this._newestIndex = this._newestIndex + 1;
    }

    this._queue[this._newestIndex] = item;
  }

  dequeue() {
    if (!this.length) return;

    const item = this._queue[this._oldestIndex];

    delete this._queue[this._oldestIndex];

    if (this._oldestIndex === this._newestIndex) {
      this._oldestIndex = undefined;
      this._newestIndex = undefined;
    } else {
      this._oldestIndex = this._oldestIndex + 1;
    }

    return item;
  }
}

module.exports = Queue;
