const axios = require('axios');

exports.makeBuild = (baseUrl, body) => axios.post(`${baseUrl}/build`, body);
