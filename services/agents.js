const Agent = require('./agent');
const getAgentId = require('../utils/getAgentId');
const { AVAILABLE, BUSY } = require('../const/agentStatus');

class Agents {
  constructor() {
    this.agents = new Map();
  }

  register({ host, port }) {
    if (!host || !port) return;

    const id = getAgentId({ host, port });
    const agent = new Agent({ id, host, port });
    this.agents.set(id, agent);

    console.log('Agents: NEW AGENT REGISTERED', { host, port });
  }

  unregister({ host, port }) {
    if (!host || !port) return;

    const id = getAgentId({ host, port });
    this.agents.delete(id);

    console.log('Agents: AGENT UNREGISTERED', { host, port });
  }

  setAgentStatusAvailable(id) {
    const agent = this.agents.get(id);
    if (!agent) return;

    agent.setStatusAvailable();
  }

  setAgentStatusBusy(id, taskId) {
    const agent = this.agents.get(id);
    if (!agent) return;

    agent.setStatusBusy(taskId);
  }

  getAvailableAgent() {
    if (!this.agents.size) return;

    let agent;
    let index = 0;
    const agentsIterator = this.agents.values();

    while (!agent && index < this.agents.size) {
      const cur = agentsIterator.next().value;

      if (cur.status === AVAILABLE) {
        agent = cur;
      } else {
        index = index + 1;
      }
    }

    if (agent) {
      console.log('Agents: AVAILABLE AGENT TAKEN', agent.id);
    }

    return agent;
  }
}

module.exports = Agents;
