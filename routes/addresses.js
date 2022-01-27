const express = require("express");
const axios = require("axios");
const router = express.Router();
const swaggerValidation = require("openapi-validator-middleware");
swaggerValidation.init("swagger.yaml");

const { validation, forward } = require('../middlewares')
const { validateAuthorization } = validation;
const { forwardRequest } = forward;
const { callRequest } = require('../helpers/api');

router.get("/rest/addresses", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
    res.send(res.response);
});

router.post("/rest/addresses", swaggerValidation.validate, validateAuthorization, async (req, res, next) => {
    const numbers = req.body.number.split(",");

    const callRequests = [];
    const existNumbers = [];
    numbers.forEach((number) => {
        callRequests.push(callRequest(req, "GET", `/rest/addresses?where=number.eq('${number}')`, null))
    });

    const responses = await axios.all(callRequests);
    for (let i = 0; i < responses.length; i++) {
        if (responses[i].data.addresses.length > 0) {
            existNumbers.push(numbers[i]);
        }
    }

    if (existNumbers.length > 0) {
        res.status(400).json({
            status: false,
            message: [existNumbers]
        });
    } else {
        for (let i = 0; i < numbers.length; i++) {
            const response = await callRequest(req, "POST", `/rest/addresses`, {}, {
                number: numbers[i],
                orgUnitId: req.body.orgUnitId
            });
        }
        res.send({
            status: true
        });
    }
});

router.delete("/rest/addresses/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
    res.send(res.response);
});

module.exports = router;