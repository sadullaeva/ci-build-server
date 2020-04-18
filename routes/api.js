const express = require('express');
const router = express.Router();

const notifyAgent = require('../controllers/notifyAgent');
const notifyBuildResult = require('../controllers/notifyBuildResult');

router.post('/notify-agent', notifyAgent);
router.post('/notify-build-result', notifyBuildResult);

module.exports = router;
