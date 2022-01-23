const axios = require('axios');

const {config} = require('../config');

exports.callRequest = async function (req, method, url, query, data) {
  return await axios({
    method: method,
    timeout: 30000,
    headers: {
      Authorization: req.headers.authorization
    },
    url: config.upstream + url,
    query: query,
    data: data
  })
}