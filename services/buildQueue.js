const Stack = require('./stack');
const loadAllWaitingBuilds = require('../controllers/loadAllWaitingBuilds');

class BuildQueue {
  constructor() {
    this._waitingQueue = new Stack();
    this._params = {
      limit: 25,
      offset: 0,
    };
    this._timeoutId = undefined;
  }

  runProcess = () => {
    clearTimeout(this._timeoutId);
    this.loadBuilds().finally(() => {
      this._timeoutId = setTimeout(this.runProcess, 120000);
    });
  };

  loadBuilds = async () => {
    const { builds, params } = await loadAllWaitingBuilds(this._params);

    builds.forEach(this.enqueue);
    this._params = params;
  };

  isEmpty = () => {
    return this._waitingQueue.size === 0;
  };

  enqueue = build => {
    this._waitingQueue.push(build);
  };

  dequeue = () => {
    return this._waitingQueue.pop();
  };
}

module.exports = BuildQueue;
