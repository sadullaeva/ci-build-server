const { finishBuild } = require('../api/storageMethods');
const { AVAILABLE } = require('../const/agentStatus');

module.exports = (req, res, next) => {
  const { success, buildId, buildLog, duration } = req.body;
  finishBuild({ success, buildId, buildLog, duration })
    .then(() => {
      const agentId = req.headers.host;
      agents.setAgentStatus(agentId, AVAILABLE);

      res.send();
    })
    .catch(e => {
      next(e);
    });
};
