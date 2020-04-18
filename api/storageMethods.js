const axios = require('./axios');

exports.startBuild = body => axios.post('/build/start', body);

exports.finishBuild = body => axios.post('/build/finish', body);

exports.cancelBuild = body => axios.post('/build/cancel', body);
