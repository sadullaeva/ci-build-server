const path = require('path');
const fs = require('fs');
const express = require('express');

const Agents = require('./store/agents');
const api = require('./routes/api');

global.config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'server-conf.json'), 'utf8'));
global.agents = new Agents();

const app = express();

app.use(express.json());

app.use('/api', api);
app.use('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(config.port || 8081);
