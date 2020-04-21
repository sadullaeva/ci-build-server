const { checkHealth } = require('../api/agents/agentMethods');
const { cancelBuild } = require('../api/storage/storageMethods');
const { AVAILABLE, BUSY } = require('../const/agentStatus');

class Agent {
  constructor({ id, host, port }) {
    this.id = id;
    this.host = host;
    this.port = port;
    this._status = AVAILABLE;
    this._taskId = undefined;
    this._healthCheckTimeoutId = 0;
  }

  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;
  }

  get taskId() {
    return this._taskId;
  }

  set taskId(taskId) {
    this._taskId = taskId;
  }

  setStatusAvailable = () => {
    this._status = AVAILABLE;
    this._taskId = undefined;

    clearTimeout(this._healthCheckTimeoutId);
  };

  setStatusBusy = taskId => {
    this._status = BUSY;
    this._taskId = taskId;

    this.checkHealth();
  };

  checkHealth = () => {
    clearTimeout(this._healthCheckTimeoutId);

    const TIMEOUT = 30000;

    checkHealth(`http://${this.host}:${this.port}/api`)
      .then(() => {
        console.log('agent: HEALTH CHECK OK', this.id);

        this._healthCheckTimeoutId = setTimeout(this.checkHealth, TIMEOUT);
      })
      .catch(() => {
        console.log('agent: HEALTH CHECK FAIL, CANCELING CURRENT TASK', this.id);

        clearTimeout(this._healthCheckTimeoutId);

        this.cancelTask();
      });
  };

  cancelTask = () => {
    const taskId = this._taskId;

    if (!taskId) return Promise.resolve();

    this._taskId = undefined;

    return cancelBuild({ buildId: taskId });
  };
}

module.exports = Agent;
