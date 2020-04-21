const { finishBuild } = require('../api/storage/storageMethods');
const { AVAILABLE } = require('../const/agentStatus');

module.exports = (req, res, next) => {
  const { success, buildId, buildLog, duration } = req.body;
  finishBuild({ success, buildId, buildLog, duration })
    .then(() => {
      const agentId = req.headers.referrer;
      agents.setAgentStatus(agentId, AVAILABLE);

      console.log('notifyBuildResult: BUILD COMPLETED', [buildId, agentId]);

      res.send();
    })
    .catch(e => {
      next(e);
    });
};
