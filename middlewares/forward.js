const axios = require('axios');

const { config } = require('../config');

exports.forwardRequest = async (req, res, next) => {
  try {
    let response = await axios({
      method: req.method,
      timeout: config.timeout,
      headers: {
        Authorization: req.headers.authorization
      },
      url: config.upstream + req.url,
      query: req.query,
      data: req.body
    })
    res.response = {
      status: true,
      data: response.data
    };
    console.log(response.status, response.data);
    next();

  } catch (ex) {
    console.log('Exception: ', ex);
    if (ex.response && ex.response.status) {
      if (ex.response.status == 404) {
        return res.status(ex.response.status).json({
          status: false,
          message: ['Đối tượng không tồn tại']
        });
      } else if (ex.response && ex.response.status) {
        return res.status(ex.response.status).json({
          status: false,
          message: [ex.response.data]
        });
      }
    } else {
      return res.status(500).json({
        status: false,
        message: [ex.message]
      });
    }
  }
}