const { finishBuild, cancelBuild } = require('../api/storage/storageMethods');
const { AVAILABLE } = require('../const/agentStatus');

const finishBuildRequest = async ({ success, buildId, buildLog, duration }) => {
  let statusOk;
  let attempts = 3;

  do {
    try {
      const response = await finishBuild({ success, buildId, buildLog, duration });

      statusOk = response && response.status === 200;
    } catch (err) {
      console.log('notifyBuildResult: COULD NOT FINISH BUILD');
    }

    attempts = attempts - 1;
  } while (!statusOk && attempts > 0);

  if (statusOk) return Promise.resolve();

  try {
    await cancelBuild({ buildId });
  } catch (err) {
    console.log('notifyBuildResult: COULD NOT EVEN CANCEL BUILD');
  }

  return Promise.resolve();
};

module.exports = (req, res, next) => {
  const { success, buildId, buildLog, duration } = req.body;
  finishBuildRequest({ success, buildId, buildLog, duration })
    .then(() => {
      const agentId = req.headers.referrer;
      agents.setAgentStatusAvailable(agentId);

      console.log('notifyBuildResult: BUILD COMPLETED', [buildId, agentId]);

      res.send();
    })
    .catch(e => {
      next(e);
    });
};
