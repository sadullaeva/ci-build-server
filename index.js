const path = require('path');
const fs = require('fs');
const express = require('express');

const Store = require('./store/store');
const api = require('./routes/api');

global.config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'server-conf.json'), 'utf8'));
global.store = new Store();

const app = express();

app.use(express.json());

app.use('/api', api);
app.use('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(config.port || 8081);
