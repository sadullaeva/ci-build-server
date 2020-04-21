class Agent {
  constructor({ id, host, port, status }) {
    this.id = id;
    this.host = host;
    this.port = port;
    this._status = status;
    this._taskId = undefined;
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
}

module.exports = Agent;
