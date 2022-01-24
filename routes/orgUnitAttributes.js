const express = require("express");
const axios = require("axios");
const router = express.Router();
const swaggerValidation = require("openapi-validator-middleware");
swaggerValidation.init("swagger.yaml");

const { database, validation, forward } = require('../middlewares');
const { validateAuthorization } = validation;
const { forwardRequest } = forward;
const { callRequest } = require('../helpers/api');

router.get("/rest/orgUnitAttributes", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
    res.send(res.response);
});

router.post("/rest/orgUnitAttributes", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {

    res.send(res.response);
});

router.put("/rest/orgUnitAttributes/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
    res.send(res.response);
});

router.delete("/rest/orgUnitAttributes/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
    res.send(res.response);
});

module.exports = router;