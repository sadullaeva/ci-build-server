const BuildQueue = require('./buildQueue');
const { BUSY } = require('../const/agentStatus');

class BuildQueueHandler {
  constructor() {
    this._buildQueue = new BuildQueue();
    this._timeoutId = undefined;

    this._buildQueue.runProcess();
  }

  handleQueue = () => {
    clearTimeout(this._timeoutId);

    const TIMEOUT = 30000;

    let isNotEmpty = !this.isEmpty();
    let agent = agents.getAvailableAgent();

    while (isNotEmpty && agent) {
      const build = this.dequeue();

      agents.setAgentStatus(agent.id, BUSY);

      // todo: send request to /build

      isNotEmpty = !this.isEmpty();
      agent = agents.getAvailableAgent();
    }

    this._timeoutId = setTimeout(this.handleQueue, TIMEOUT);
  };

  isEmpty = () => {
    return this._buildQueue.isEmpty();
  };

  dequeue = () => {
    return this._buildQueue.dequeue();
  };
}

module.exports = BuildQueueHandler;
