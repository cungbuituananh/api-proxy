const axios = require('axios');

const {config} = require('../config');

exports.callRequest = async function (req, method, url, query, data) {
  const response = await axios({
    method: method,
    timeout: config.timeout,
    headers: {
      Authorization: req.headers.authorization
    },
    url: config.upstream + url,
    query: query,
    data: data
  });
  
  console.log(response.status, response.data);
  return response;
}