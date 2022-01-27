const express = require("express");
const axios = require("axios");
const router = express.Router();
const swaggerValidation = require("openapi-validator-middleware");
swaggerValidation.init("swagger.yaml");

const { validation, forward } = require('../middlewares')
const { validateAuthorization, validateNameUnique } = validation;
const { forwardRequest } = forward;
const { callRequest } = require('../helpers/api');

router.get("/rest/orgUnits", swaggerValidation.validate, validateAuthorization, forwardRequest, async (req, res, next) => {
    if (res.response.data.orgUnits && res.response.data.orgUnits.length > 0) {
        res.send(res.response);
    }

    res.send({
        status: false,
        message: ["PBX does not exists"]
    });
});

router.post("/rest/orgUnits", swaggerValidation.validate, validateAuthorization, validateNameUnique, forwardRequest, async (req, res, next) => {
    res.send(res.response);
});

router.delete("/rest/orgUnits/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
    res.send(res.response);
});

module.exports = router;