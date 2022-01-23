const express = require("express");
const axios = require("axios");
const router = express.Router();
const swaggerValidation = require("openapi-validator-middleware");
swaggerValidation.init("swagger.yaml");

const { database, validation, forward} = require('../middlewares')
const { syncUser } = database;
const { validateAuthorization } = validation;
const { forwardRequest } = forward;

router.post("/rest/userRoles", swaggerValidation.validate, validateAuthorization, forwardRequest, syncUser, (req, res, next) => {
    res.send(res.response);
});

module.exports = router;