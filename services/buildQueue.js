const Queue = require('./queue');
const loadAllWaitingBuilds = require('../controllers/loadAllWaitingBuilds');

class BuildQueue {
  constructor() {
    this._waitingQueue = new Queue();
    this._params = {
      limit: 25,
      offset: 0,
    };
    this._timeoutId = undefined;
    this._lastLoadedBuildId = undefined;
  }

  runProcess = () => {
    clearTimeout(this._timeoutId);

    const TIMEOUT = 120000;

    this.loadBuilds().finally(() => {
      this._timeoutId = setTimeout(this.runProcess, TIMEOUT);
    });
  };

  loadBuilds = () => {
    return loadAllWaitingBuilds(this._params, this._lastLoadedBuildId)
      .then(result => {
        const { builds, lastLoadedBuildId } = result;

        for (let i = builds.length - 1; i >= 0; i--) {
          this.enqueue(builds[i]);
        }

        if (lastLoadedBuildId) {
          this._lastLoadedBuildId = lastLoadedBuildId;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  isEmpty = () => {
    return this._waitingQueue.length === 0;
  };

  enqueue = build => {
    this._waitingQueue.enqueue(build);
  };

  dequeue = () => {
    return this._waitingQueue.dequeue();
  };
}

module.exports = BuildQueue;
