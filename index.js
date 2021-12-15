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
  console.log(req.body)

  res.send(res.response);
});

app.delete("/rest/orgUnits/:xId", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//rest/users
app.get("/rest/users", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

app.post("/rest/users", swaggerValidation.validate, validateAuthorization, async (req, res, next) => {
  try {
    let [lastName, ...firstName] = req.body.fullName.split(" ")
    delete req.body.fullName;
    const response = await callRequest(req, "POST", `/rest/users`, {}, {
      lastName: lastName,
      firstName: firstName.join(" "),
      ...req.body
    });

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
  if (res.response.data.addresses && res.response.data.addresses.length > 0) {
    res.send(res.response);
  } 

  res.send({
    status: false,
    message: ["PBX does not exists"]
  });
});

app.post("/rest/addresses", swaggerValidation.validate, validateAuthorization, async (req, res, next) => {
  const numbers = req.body.number.split(",");

  const callRequests = [];
  const existNumbers = [];
  numbers.forEach((number) => {
    callRequests.push(callRequest(req, "GET", `/rest/addresses?where=number.eq('${number}')`, {}))
  });

  const responses = await axios.all(callRequests)

  for (let i = 0; i < responses.length; i++) {
    if (responses[i].data.length > 0) {
      existNumbers.push(numbers[i])
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
});

app.delete("/rest/addresses", swaggerValidation.validate, validateAuthorization, forwardRequest, (req, res, next) => {
  res.send(res.response);
});

//rest/orgUnitAttributes
// FIXME: not working
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

//rest/validateReg
app.post("/rest/validateReg", swaggerValidation.validate, validateAuthorization, async (req, res, next) => {
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

//rest/validateAddSIP
app.post("/rest/validateAddSIP", swaggerValidation.validate, validateAuthorization, async (req, res, next) => {
  try {
    const numbers = req.body.number.split(",");

    const callRequests = [];
    const existNumbers = [];

    numbers.forEach((number) => {
      callRequests.push(callRequest(req, "GET", `/rest/addresses?where=number.eq('${number}')`, {}))
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
    return res.status(ex.response.status).json({
      status: false,
      message: [ex.response.data]
    });
  }
});

//health
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

    return res.status(400)
      .json({
        status: false,
        message: err.errors.map((info, index) => capitalizeFirstLetter(fieldName[index] + info.message))
      });
  }
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


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
      data: req.body
    })

    res.response = {
      status: true,
      data: response.data
    };
    next();

  } catch (ex) {
    if (ex.response && ex.response.status == 404) {
      return res.status(ex.response.status).json({
        status: false,
        message: ['Đối tượng không tồn tại']
      });
    } else {
      return res.status(ex.response.status).json({
        status: false,
        message: [ex.response.data]
      });
    }

  }
}

async function callRequest(req, method, url, query, data) {
  console.log("Body", data);
  return await axios({
    method: method,
    timeout: 30000,
    headers: {
      Authorization: req.headers.authorization
    },
    url: UPSTREAM + url,
    query: query,
    data: data
  })
}

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
