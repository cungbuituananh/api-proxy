const express = require("express");
const morgan = require("morgan");
const request = require("request");
const axios = require("axios");
const bodyParser = require('body-parser');

const {config} = require('./config');
const utils = require('./helpers/utils');
const swaggerValidation = require("openapi-validator-middleware");
swaggerValidation.init("swagger.yaml");

const routes = require('./routes');

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());

app.use('/', routes.addresses);
app.use('/', routes.orgUnitAttributes);
app.use('/', routes.orgUnits);
app.use('/', routes.users);

app.use('/', routes.userRoles);

app.use('/', routes.custom);

app.get("/health", (req, res, next) => {
  res.send("This is a proxy service");
});

app.use((err, req, res, next) => {
  if (err instanceof swaggerValidation.InputValidationError) {

    let fieldName = [];
    for (let i = 0; i < err.errors.length; i++) {
      if (err.errors[i].dataPath) {
        const dataPath = err.errors[i].dataPath.split('.');
        fieldName.push(dataPath[dataPath.length - 1] + ' ');
      } else {
        fieldName.push('body ');
      }
    }
    console.log(req.body, err.errors);
    return res.status(400)
      .json({
        status: false,
        message: err.errors.map((info, index) => utils.capitalizeFirstLetter(fieldName[index] + info.message))
      });
  }
});


app.listen(config.port, config.host, () => {
  console.log(`Starting Proxy at ${config.host}:${config.port}`);
});
