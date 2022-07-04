const {callRequest} = require('../helpers/api');
const {config} = require('../config');

exports.createMaxServiceExtensions = async (req, res, next) => {
  next();

  if (res.response && res.response.data && res.response.data.id) {

    await new Promise(resolve => setTimeout(resolve, 5000));

    await callRequest(req, "POST",
        `/rest/orgUnitAttributes`, {}, {
          name: "maxServiceExtensions",
          value: config.maxServiceExtensions,
          orgUnitId: res.response.data.id
        });

  } else {
    next();
  }

};

