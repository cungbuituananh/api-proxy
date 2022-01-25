const express = require("express");
const axios = require("axios");
const router = express.Router();
const swaggerValidation = require("openapi-validator-middleware");
swaggerValidation.init("swagger.yaml");

const { database, validation, forward } = require('../middlewares')
const { callRequest } = require('../helpers/api');
const { User, Attribute } = require('../database/models');

const { syncAttribute } = database;
const { validateAuthorization } = validation;

router.post("/rest/validateReg", swaggerValidation.validate, validateAuthorization, async (req, res, next) => {
    try {
        const email = req.body.email;
        const name = req.body.name;
        const publicNumber = req.body.publicNumber;

        const validateEmailResponse = await callRequest(req, "GET", `/rest/users?where=email.eq('${email}')`, {});
        if (validateEmailResponse.data.users && validateEmailResponse.data.users.length > 0) {
            return res.status(400).json({
                status: false,
                message: ["The email is already exists"]
            });
        };

        const validateNameResponse = await callRequest(req, "GET", `/rest/orgUnits?where=name.eq('${name}')`, {});
        if (validateNameResponse.data.orgUnits && validateNameResponse.data.orgUnits.length > 0) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: ["The name is already exists"]
                });
        };

        const validatePublicNumberResponse = await callRequest(req, "GET", `/rest/addresses?where=number.eq('${publicNumber}')`, {});
        if (validatePublicNumberResponse.data.addresses && validatePublicNumberResponse.data.addresses.length > 0) {
            return res
                .status(400)
                .json({
                    status: false,
                    message: ["The public number is already exists"]
                });
        };

        res.status(200).json({
            status: true
        })
    } catch (ex) {
        return res.status(ex.response.status).json({
            status: false,
            message: [ex.response.data]
        });
    }
});

router.post("/rest/validateAddSIP", swaggerValidation.validate, validateAuthorization, async (req, res, next) => {
    try {
        const numbers = req.body.number.split(",");
        const regex = /((84|0)([3|5|7|8|9]))([0-9]{8})\b/;

        const callRequests = [];
        const existNumbers = [];

        numbers.forEach((number) => {
            if (!regex.test(number)) {
                throw `${number} invalid`
            }
            callRequests.push(callRequest(req, "GET", `/rest/addresses?where=number.eq('${number}')`, "", {}))
        });

        const responses = await axios.all(callRequests)

        for (let i = 0; i < responses.length; i++) {
            if (responses[i].data.length > 0) {
                existNumbers.push(parseInt(numbers[i]).data)
            } else {
                return res.status(200).json({
                    status: true
                });
            }
        }

        res.status(400).json({
            status: false,
            message: [existNumbers]
        });

    } catch (ex) {
        return res.status(400).json({
            status: false,
            message: [ex]
        });
    }
});

router.post("/rest/block", swaggerValidation.validate, validateAuthorization, syncAttribute, async (req, res, next) => {
    try {
        const pbxId = req.body.orgUnitId;

        const attribute = await Attribute.findOne({
            where: {
                pbxId
            }
        });

        if (attribute.externalChannelId) {
            const updateMaxExternalChannels = await callRequest(req, "PUT", `/rest/orgUnitAttributes/${attribute.externalChannelId}`, {}, {
                id: attribute.externalChannelId,
                name: "maxExternalChannels",
                value: 0,
                orgUnitId: pbxId
            });
        }

        if (attribute.channelId) {
            const updateMaxChannels = await callRequest(req, "PUT", `/rest/orgUnitAttributes/${attribute.channelId}`, {}, {
                id: attribute.channelId,
                name: "maxChannels",
                value: 0,
                orgUnitId: pbxId
            });
        } else {
            const createMaxChannels = await callRequest(req, "POST", `/rest/orgUnitAttributes`, {}, {
                name: "maxChannels",
                value: 0,
                orgUnitId: pbxId
            });

            await Attribute.update({
                channelId: createMaxChannels.data.id,
                channel: createMaxChannels.data.value
            }, {
                where: {
                    pbxId
                }
            });
        }

        const users = await User.findAll({
            where: {
                pbxId
            }
        });
        for (let i = 0; i < users.length; i++) {
            const blockUser = await callRequest(req, "PUT", `/rest/users/${users[i].userId}`, {}, {
                id: users[i].userId,
                passwordBlocked: 9223372036854111111
            });
        }
        res.status(200).json({
            status: true
        })
    } catch (ex) {
        return res.status(400).json({
            status: false,
            message: [ex]
        });
    }
});

router.post("/rest/open", swaggerValidation.validate, validateAuthorization, async (req, res, next) => {
    try {
        const pbxId = req.body.orgUnitId;

        const attribute = await Attribute.findOne({
            where: {
                pbxId
            }
        });

        if (attribute.externalChannelId) {
            const updateMaxExternalChannels = await callRequest(req, "PUT", `/rest/orgUnitAttributes/${attribute.externalChannelId}`, {}, {
                id: attribute.externalChannelId,
                name: "maxExternalChannels",
                value: attribute.externalChannel,
                orgUnitId: pbxId
            });
        }

        if (attribute.channelId) {
            const deleteMaxChannels = await callRequest(req, "DELETE", `/rest/orgUnitAttributes/${attribute.channelId}`);

            await Attribute.update({
                channelId: null,
                channel: null
            }, {
                where: {
                    pbxId
                }
            });
        }

        const users = await User.findAll({
            where: {
                pbxId
            }
        });

        for (let i = 0; i < users.length; i++) {
            const blockUser = await callRequest(req, "PUT", `/rest/users/${users[i].userId}`, {}, {
                id: users[i].userId,
                passwordBlocked: 0
            });
        }

        res.status(200).json({
            status: true
        })

    } catch (ex) {
        return res.status(400).json({
            status: false,
            message: [ex]
        });
    }
});


module.exports = router;