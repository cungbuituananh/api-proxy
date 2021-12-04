const express = require("express");
const morgan = require("morgan");
const request = require("request");
const axios = require("axios");
const bodyParser = require('body-parser');

const swaggerValidation = require("openapi-validator-middleware");

const app = express();

swaggerValidation.init("swagger.yaml");

// Configuration
const PORT = 4000;
const HOST = "0.0.0.0";
const UPSTREAM = "https://apac-v7-sandbox.aarenet.com";

app.use(morgan("dev"));
app.use(bodyParser.json());

//rest/orgUnits
app.get("/rest/orgUnits", swaggerValidation.validate, forwardRequest, async (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/orgUnits", swaggerValidation.validate, forwardRequest, async (req, res, next) => {
  res.send(res.response);
});

//rest/users
app.get("/rest/users", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/users", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.put("/rest/users/:xId", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.delete("/rest/users/:xId", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//rest/userRoles
app.post("/rest/userRoles", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//rest/addresses
app.get("/rest/addresses", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/addresses", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.delete("/rest/addresses", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//rest/orgUnitAttributes
app.get("/rest/orgUnitAttributes", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/orgUnitAttributes", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.put("/rest/orgUnitAttributes/:xId", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.delete("/rest/orgUnitAttributes/:xId", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//health
app.get("/health", (req, res, next) => {
  res.send("This is a proxy service");
});

app.use((err, req, res, next) => {
  if (err instanceof swaggerValidation.InputValidationError) {
    return res
      .status(400)
      .json({
        messages: err.errors.map((info) => info.message)
      });
  }
});

async function forwardRequest(req, res, next) {
  if (req.headers.authorization === undefined) {
    return res.status(403)
      .json({
        status: false,
        message: ['Authorization header is required']
      });
  }

  try {
    console.log(req.body);
    let response = await axios({
      method: req.method,
      timeout: 30000,
      headers: {
        Authorization: req.headers.authorization
      },
      url: UPSTREAM + req.url,
      query: req.query,
      data: req.body
    });

    if (response.status < 400) {
      res.response = response.data;
      next();
    } else {
      return res
        .status(response.status)
        .json({
          status: false,
          data: req.body
        });
    }
  } catch (ex) {
    return res
      .status(ex.response.status)
      .json({
        status: false,
        data: ex.response.data
      });
  }
}

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
