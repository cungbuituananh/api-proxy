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
app.get("/rest/orgUnits", swaggerValidation.validate, validateAuthorization, forwardRequest, async (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/orgUnits", swaggerValidation.validate, validateAuthorization, forwardRequest, async (req, res, next) => {
  res.send(res.response);
});

//rest/users
app.get("/rest/users", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/users", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.put("/rest/users/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.delete("/rest/users/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//rest/userRoles
app.post("/rest/userRoles", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//rest/addresses
app.get("/rest/addresses", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/addresses", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.delete("/rest/addresses", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//rest/orgUnitAttributes
app.get("/rest/orgUnitAttributes", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/orgUnitAttributes", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.put("/rest/orgUnitAttributes/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.delete("/rest/orgUnitAttributes/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//health
app.get("/health", (req, res, next) => {
  res.send("This is a proxy service");
});

//test
app.get("/test", async (req, res, next) => {
  let response = await callRequest(req, 'GET', "/rest/addresses?where=number.eq('0399093745')", {});
  console.log(response.data);
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


async function validateAuthorization(req, res, next) {
  if (req.headers.authorization === undefined) {
    return res.status(403)
      .json({
        status: false,
        message: ['Authorization header is required']
      });
  }
  next();
}

async function forwardRequest(req, res, next) {
  try {
    let response = await axios({
      method: req.method,
      timeout: 1000,
      headers: {
        Authorization: req.headers.authorization
      },
      url: UPSTREAM + req.url,
      query: req.query,
      data: {
        status: true,
        data: req.body
      }
    })

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
    console.log(ex)
  }
}

async function callRequest(req, method, url, query, data) {
  return await axios({
    method: req.method,
    timeout: 1000,
    headers: {
      Authorization: req.headers.authorization
    },
    url: UPSTREAM + url,
    query: query,
    data: {
      status: true,
      data: data
    }
  })
}

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
