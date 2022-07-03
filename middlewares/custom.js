const {callRequest} = require('../helpers/api');
const {config} = require('../config');

exports.createMaxServiceExtensions = async (req, res, next) => {

  if (res.response && res.response.data && res.response.data.id) {

    const createMaxServiceExtensions = await callRequest(req, "POST",
        `/rest/orgUnitAttributes`, {}, {
          name: "maxServiceExtensions",
          value: config.maxServiceExtensions,
          orgUnitId: res.response.data.id
        });

    console.log('createMaxServiceExtensions', createMaxServiceExtensions);
    next();
  } else {
    next();
  }

};

