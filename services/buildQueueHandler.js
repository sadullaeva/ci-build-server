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
    console.log('BuildQueueHandler: PROCESS IS RUN');

    clearTimeout(this._settingsTimeoutId);

    const TIMEOUT = 30000;

    getSettings()
      .then(response => {
        this._settings = response.data.data;

        this.handleQueue();

        console.log('BuildQueueHandler: SETTINGS RECEIVED', this._settings);
        console.log('BuildQueueHandler: START HANDLING QUEUE');
      })
      .catch(err => {
        console.log('BuildQueueHandler: SETTINGS NOT RECEIVED, TRYING AGAIN', err);

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

      this.runBuild(agent, build);

      console.log('BuildQueueHandler: TASK TO RUN BUILD', [build.buildNumber, agent.id]);

      isNotEmpty = !this.isEmpty();
      agent = agents.getAvailableAgent();
    }

    this._queueTimeoutId = setTimeout(this.handleQueue, TIMEOUT);
  };

  runBuild = (agent, build) => {
    agents.setAgentStatus(agent.id, BUSY);

    const { host, port } = agent;

    this.makeBuildRequest(agent, build)
      .then(response => {
        console.log('BuildQueueHandler: BUILD IS RUN', [build.buildNumber, agent.id]);

        const { startTime } = response.data;

        return this.startBuildRequest(build.id, startTime);
      })
      .catch(err => {
        console.log('BuildQueueHandler: BUILD NOT RUN', [build.buildNumber, agent.id, err]);

        agents.unregister({ host, port });

        this.enqueue(build);

        console.log('BuildQueueHandler: AGENT UNREGISTERED', agent.id);
        console.log('BuildQueueHandler: BUILD RETURNED TO QUEUE', build.buildNumber);
      });
  };

  makeBuildRequest = (agent, build) => {
    const { host, port } = agent;

    const url = `http://${host}:${port}/api`;
    const data = {
      buildId: build.id,
      commitHash: build.commitHash,
      repoName: this._settings.repoName,
      mainBranch: this._settings.mainBranch,
      command: this._settings.buildCommand,
    };

    return makeBuild(url, data).catch(err => {
      console.log('BuildQueueHandler: COULD NOT CHANGE BUILD STATUS', err);

      // todo: think how to handle
    });
  };

  startBuildRequest = async (buildId, dateTime) => {
    return await startBuild({ buildId, dateTime });
  };

  isEmpty = () => {
    return this._buildQueue.isEmpty();
  };

  enqueue = build => {
    this._buildQueue.enqueue(build);
  };

  dequeue = () => {
    return this._buildQueue.dequeue();
  };
}

module.exports = BuildQueueHandler;
