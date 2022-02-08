const { callRequest } = require('../helpers/api');

exports.validateAuthorization = async (req, res, next) => {
    if (req.headers.authorization === undefined) {
        res.status(403)
            .json({
                status: false,
                message: ['Authorization header is required']
        });
    }else {
        next();
    }
}

exports.validateNameUnique = async (req, res, next) => {
    if (req.body.name) {
        const response = await callRequest(req, "GET", `/rest/orgUnits?where=name.eq('${req.body.name}')`);
        console.log(response);
        if (response && response.data && response.data.orgUnits && response.data.orgUnits.length > 0) {
            res.status(400).json({
                status: false,
                message: ["Name is already exists"]
            });
        }else {
            next();
        }
    }else {
        next();
    }
}

exports.validateEmailUnique = async (req, res, next) => {
    if (req.body.email) {
        const response = await callRequest(req, "GET", `/rest/users?where=email.eq('${req.body.email}')`);
        if (response && response.data && response.data.users && response.data.users.length > 0) {
            res.status(400).json({
                status: false,
                message: ["Email is already exists"]
            });
        }else {
            next();
        }
    }else {
        next();
    }
}
