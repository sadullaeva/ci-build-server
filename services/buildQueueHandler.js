const BuildQueue = require('./buildQueue');
const { BUSY } = require('../const/agentStatus');
const { getSettings, startBuild } = require('../api/storage/storageMethods');
const { makeBuild } = require('../api/agents/agentMethods');

class BuildQueueHandler {
  constructor() {
    this._buildQueue = new BuildQueue();
    this._settings = undefined;
    this._queueTimeoutId = undefined;
    this._settingsTimeoutId = undefined;

    this._buildQueue.runProcess();
  }

  runProcess = () => {
    clearTimeout(this._settingsTimeoutId);

    const TIMEOUT = 30000;

    getSettings()
      .then(response => {
        this._settings = response.data.data;

        this.handleQueue();
      })
      .catch(err => {
        console.log('Could not get settings', err);

        this._settingsTimeoutId = setTimeout(this.runProcess, TIMEOUT);
      });
  };

  handleQueue = () => {
    clearTimeout(this._queueTimeoutId);

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

    this._queueTimeoutId = setTimeout(this.handleQueue, TIMEOUT);
  };

  isEmpty = () => {
    return this._buildQueue.isEmpty();
  };

  dequeue = () => {
    return this._buildQueue.dequeue();
  };
}

module.exports = BuildQueueHandler;
