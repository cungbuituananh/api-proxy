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
  res.send("GET /rest/users");
});

app.post("/rest/users", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("POST /rest/users");
});

app.put("/rest/users/:xId", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("POST /rest/users/:xId");
});

app.delete("/rest/users/:xId", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("DELETE /rest/users/:xId");
});

//rest/userRoles
app.post("/rest/userRoles", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("POST /rest/userRoles");
});

//rest/addresses
app.get("/rest/addresses", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("GET /rest/addresses");
});

app.post("/rest/addresses", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("POST /rest/addresses");
});

app.delete("/rest/addresses", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("DELETE /rest/addresses");
});

//rest/orgUnitAttributes
app.get("/rest/orgUnitAttributes", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("GET /rest/orgUnitAttributes");
});

app.post("/rest/orgUnitAttributes", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("POST /rest/orgUnitAttributes");
});

app.put("/rest/orgUnitAttributes/:xId", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("PUT /rest/orgUnitAttributes/:xId");
});

app.delete("/rest/orgUnitAttributes/:xId", swaggerValidation.validate, forwardRequest, (req, res, next) => {
  res.send("DELETE /rest/orgUnitAttributes/:xId");
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

async function forwardRequest (req, res, next) {

  if(!req.headers.authorization) {
    return res.status(response.status)
    .json({
      status: false,
      message: ['Authorization header is required']
    });
  }

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

  if(response.status < 400) {
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
}


app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
