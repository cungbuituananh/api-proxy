const express = require("express");
const morgan = require("morgan");
const request = require("request");
const swaggerValidation = require("openapi-validator-middleware");

const app = express();

swaggerValidation.init("swagger.yaml");

// Configuration
const PORT = 4000;
const HOST = "0.0.0.0";
const UPSTREAM = "https://apac-v7-sandbox.aarenet.com";

app.use(morgan("dev"));

app.get("/info", (req, res, next) => {
  res.send("This is a proxy service");
});

//rest/orgUnits
app.get("/rest/orgUnits", swaggerValidation.validate, (req, res, next) => {
  res.send("GET /rest/orgUnits");
});

app.post("/rest/orgUnits", swaggerValidation.validate, (req, res, next) => {
  res.send("POST /rest/orgUnits");
});

//rest/users
app.get("/rest/users", swaggerValidation.validate, (req, res, next) => {
  res.send("GET /rest/users");
});

app.post("/rest/users", swaggerValidation.validate, (req, res, next) => {
  res.send("POST /rest/users");
});

app.put("/rest/users/:xId", swaggerValidation.validate, (req, res, next) => {
  res.send("POST /rest/users/");
});

app.delete("/rest/users/:xId", swaggerValidation.validate, (req, res, next) => {
  res.send("DELETE /rest/users/:xId");
});

//rest/userRoles
app.post("/rest/userRoles", swaggerValidation.validate, (req, res, next) => {
  res.send("POST /rest/userRoles");
});

//rest/addresses
app.get("/rest/addresses", swaggerValidation.validate, (req, res, next) => {
  res.send("GET /rest/addresses");
});

app.post("/rest/addresses", swaggerValidation.validate, (req, res, next) => {
  res.send("POST /rest/addresses");
});

app.delete("/rest/addresses", swaggerValidation.validate, (req, res, next) => {
  res.send("DELETE /rest/addresses");
});

//rest/orgUnitAttributes
app.get(
  "/rest/orgUnitAttributes",
  swaggerValidation.validate,
  (req, res, next) => {
    res.send("GET /rest/orgUnitAttributes");
  }
);

app.post(
  "/rest/orgUnitAttributes",
  swaggerValidation.validate,
  (req, res, next) => {
    res.send("POST /rest/orgUnitAttributes");
  }
);

app.put(
  "/rest/orgUnitAttributes/:xId",
  swaggerValidation.validate,
  (req, res, next) => {
    res.send("PUT /rest/orgUnitAttributes/:xId");
  }
);

app.delete(
  "/rest/orgUnitAttributes/:xId",
  swaggerValidation.validate,
  (req, res, next) => {
    res.send("DELETE /rest/orgUnitAttributes/:xId");
  }
);

app.use((err, req, res, next) => {
  if (err instanceof swaggerValidation.InputValidationError) {
    return res
      .status(400)
      .json({ more_info: err.errors.map((info) => info.message) });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
