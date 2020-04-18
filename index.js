const path = require('path');
const fs = require('fs');

global.config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'server-conf.json'), 'utf8'));

const express = require('express');

const app = express();

app.use(express.json());

app.use('*', (req, res) => {
  res.sendStatus(404);
});

app.listen(config.port || 8081);
