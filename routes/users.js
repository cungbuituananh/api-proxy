const express = require("express");
const axios = require("axios");
const router = express.Router();
const swaggerValidation = require("openapi-validator-middleware");
swaggerValidation.init("swagger.yaml");

const { database, validation, forward } = require('../middlewares')
const { validateAuthorization, validateEmailUnique } = validation;
const { forwardRequest } = forward;
const { callRequest } = require('../helpers/api');

router.get("/rest/users", swaggerValidation.validate, validateAuthorization, validateEmailUnique, forwardRequest, (req, res, next) => {
    if (res.response.data.users && res.response.data.users.length > 0) {
        res.send(res.response);
    }

    res.send({
        status: false,
        message: ["User does not exists"]
    });
});

router.post("/rest/users", swaggerValidation.validate, validateAuthorization, validateEmailUnique, async (req, res, next) => {
    try {
        let [lastName, ...firstName] = req.body.fullName.split(" ")
        delete req.body.fullName;
        const response = await callRequest(req, "POST", `/rest/users`, {}, {
            lastName: lastName,
            firstName: firstName.join(" "),
            ...req.body
        });

        if (response.data) {
            const userRoleResponse = await callRequest(req, "POST", `/rest/userRoles`, {}, {
                userId: "" + response.data.id,
                role: "pbx",
                orgUnitId: response.data.orgUnitId
            });
        }
        

        res.status(200).json({
            status: true,
            data: response.data
        })
    } catch (ex) {
        res.status(ex.response.status).json({
            status: false,
            message: [ex.response.data]
        });
    }
});

router.put("/rest/users/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
    res.send(res.response);
});

router.delete("/rest/users/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
    res.send(res.response);
});

module.exports = router;