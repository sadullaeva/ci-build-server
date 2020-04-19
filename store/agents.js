const Agent = require('./agent');
const getAgentId = require('../utils/getAgentId');
const { AVAILABLE } = require('../const/agentStatus');

class Agents {
  constructor() {
    this.agents = new Map();
  }

  register({ host, port }) {
    if (!host || !port) return;

    const id = getAgentId({ host, port });
    const agent = new Agent({ id, host, port, status: AVAILABLE });
    this.agents.set(id, agent);
  }

  unregister({ host, port }) {
    if (!host || !port) return;

    const id = getAgentId({ host, port });
    this.agents.delete(id);
  }

  setAgentStatus(id, status) {
    const agent = this.agents.get(id);
    if (!agent) return;

    agent.status = status;
  }
}

module.exports = Agents;
