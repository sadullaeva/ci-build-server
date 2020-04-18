class Agent {
  constructor({ id, host, port, status }) {
    this.id = id;
    this.host = host;
    this.port = port;
    this._status = status;
  }

  get status() {
    return this._status;
  }

  set status(status) {
    this._status = status;
  }
}

module.exports = Agent;
