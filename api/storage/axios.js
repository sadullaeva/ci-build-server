const axios = require('axios');
const https = require('https');

const { apiToken, apiBaseUrl } = config;

const instance = axios.create({
  baseURL: apiBaseUrl,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

instance.defaults.headers.common['Authorization'] = `Bearer ${apiToken}`;

module.exports = instance;
