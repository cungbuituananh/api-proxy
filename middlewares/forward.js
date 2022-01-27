const axios = require('axios');

const { config } = require('../config');
const { callRequest } = require('../helpers/api');

exports.forwardRequest = async (req, res, next) => {
  try {
    const response = await callRequest(req, req.method, req.url, req.query, req.body);    
    res.response = {
      status: true,
      data: response.data
    };
    next();
  } catch (ex) {
    console.log('Exception: ', ex);
    if (ex.response && ex.response.status) {
      if (ex.response.status == 404) {
        return res.status(ex.response.status).json({
          status: false,
          message: ['Object is not exist']
        });
      }if (ex.response.status == 403) {
        return res.status(ex.response.status).json({
          status: false,
          message: ["Don't have permission to access this resource"]
        });
      } else if (ex.response && ex.response.status) {
        return res.status(ex.response.status).json({
          status: false,
          message: [ex.response.data]
        });
      }
    } else {
      const errorMessage = ex.message ? ex.message : "System error"
      return res.status(500).json({
        status: false,
        message: [ex.message]
      });
    }
  }
}