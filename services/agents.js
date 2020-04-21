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

    console.log('Agents: NEW AGENT REGISTERED', { host, port });
  }

  unregister({ host, port }) {
    if (!host || !port) return;

    const id = getAgentId({ host, port });
    this.agents.delete(id);

    console.log('Agents: AGENT UNREGISTERED', { host, port });
  }

  setAgentStatus(id, status) {
    const agent = this.agents.get(id);
    if (!agent) return;

    agent.status = status;
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

    console.log('Agents: AVAILABLE AGENT TAKEN', agent);

    return agent;
  }
}

module.exports = Agents;
