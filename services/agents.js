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

  getAvailableAgent() {
    let agent;
    let index = 0;
    const agentsIterator = this.agents.entries();

    while (!agent && index < this.agents.size) {
      const cur = agentsIterator.next().value;

      if (cur.status === AVAILABLE) {
        agent = cur;
      } else {
        index = index + 1;
      }
    }

    return agent;
  }
}

module.exports = Agents;
