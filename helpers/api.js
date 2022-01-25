const axios = require('axios');

const {config} = require('../config');

exports.callRequest = async function (req, method, url, query, data) {
  const request = {
    method: method,
    timeout: config.timeout,
    headers: {
      Authorization: req.headers.authorization
    },
    url: config.upstream + url,
    query: query,
    data: data
  };

  const response = await axios(request);
  console.info(request, response.data, response.status);
  return response;
}