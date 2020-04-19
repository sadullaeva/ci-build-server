const path = require('path');
const fs = require('fs');
const express = require('express');

/* First of all, we load config */
global.config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'server-conf.json'), 'utf8'));

/* Then, we load internal dependencies */
const Agents = require('./services/agents');
const BuildQueue = require('./services/buildQueue');
const api = require('./routes/api');

/* Create storage for agents */
global.agents = new Agents();

/* Create build queue */
const buildQueue = new BuildQueue();
buildQueue.runProcess();

const app = express();

app.use(express.json());

app.use('/api', api);
app.use('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(config.port || 8081);
