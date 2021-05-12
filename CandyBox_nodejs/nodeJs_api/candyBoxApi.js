/* eslint-disable no-undef */
const { PaymentRequestHandler } = require("./handlers/paymentRequestHandler");
const { DepositRequestHandler } = require("./handlers/depositRequestHandler");
const { CandyConstants } = require("./constants/candyConstants");
const { Validations } = require("./validations/validations");
const { ValidationSchemes } = require("./validations/ValidationSchemes");
const {
  ClientsAccountCacheUtils,
} = require("./utils/clientsAccountCacheUtils");

const express = require("express");
const { CandyMessages } = require("./constants/candyMessages");
const { Utils } = require("./utils/utils");
const { CandyErrors } = require("./constants/candyErrors");
const { Users } = require("./db/users");
const { docSetup } = require("./db/docSetup");
const { LogUtils } = require("./utils/logUtils");
const { DbUtils } = require("./db/dbUtils");
const { ApiUtils } = require("./utils/apiUtils");
const { getCandyPriceList } = require("./db/priceList");

const { ExpressSetup } = require("./utils/expressSetup");

const paymentRequestHandler = new PaymentRequestHandler();
const depositRequestHandler = new DepositRequestHandler();
const validations = new Validations();
const validationSchemes = new ValidationSchemes();
const clientsAccountCache = new ClientsAccountCacheUtils();
const expressSetup = new ExpressSetup();
const apiUtils = new ApiUtils();
const dbUtils = new DbUtils();
const users = new Users();
const utils = new Utils();

const doc = docSetup.doc;
const app = express();

//--NodeJs Server Init -----
expressSetup.setUpNodeJsServer(app, express);
//---------------

//--Init database formulas
dbUtils.setDbFormulas(doc);
//--------------

//--INIT CACHE---//
let balanceDictionary = new Map();
clientsAccountCache.updateUsersBalances(doc, balanceDictionary).then(
  (response) =>
    //--CANDY BOX STARTED---//
    response
      ? LogUtils.log(
          CandyConstants.nodeJsServerName,
          CandyMessages.candyBoxStarted
        )
      : LogUtils.log(
          CandyConstants.nodeJsServerName,
          CandyMessages.candyBoxNotStarted
        )
  //---------------
);
//---------------

app.get("/api/CandyBoxNodeJs", (req, res) => {
  res.send("Welcome to CandyBox_Api....");
});

app.post("/api/clientBalanceQuery", async (req, res) => {
  // volano jako asynchroni metoda viz async(req, res)
  const request = req.body;

  let error = validations.requestValidation(
    CandyConstants.nodeJsServerName,
    validationSchemes.clientAccountBalanceQuerySchema,
    request
  );
  if (error !== undefined) {
    res.status(400).send(JSON.stringify(error));
  } else {
    res.send(JSON.stringify(balanceDictionary.get(request.userName)));
  }
});

let depositLock = false; //TODO remove lock from endpoint, make new US
app.post("/api/depositRequest", async (req, res) => {
  // request{
  // userName: "name",
  // deposit: "deposit"
  // }

  const request = req.body;

  if (typeof request.deposit !== "number") {
    //TODO try improve
    request.deposit = parseInt(request.deposit);
  }

  let error = validations.requestValidation(
    CandyConstants.nodeJsServerName,
    validationSchemes.depositSchema,
    request
  );

  if (error !== undefined) {
    res.status(400).send(apiUtils.serverNotAvailableResponse(error));
  } else {
    let enrichResponse = depositRequestHandler.enrich(
      request.deposit,
      balanceDictionary.get(request.userName),
      doc,
      request.userName
    );
    res.send(JSON.stringify(enrichResponse));
    await clientsAccountCache.softUpdateUserBalance(
      //TODO call in enrich new US
      request.userName,
      request.deposit,
      balanceDictionary
    );

    if (depositLock) {
      for (let i = 0; i < 10; i++) {
        //TODO retry max to const
        await utils.delay(1000);
        if (!depositLock) {
          break;
        }
        if (i === 9) {
          LogUtils.log(
            CandyConstants.nodeJsServerName,
            CandyErrors.depositNotStored(request.userName, request.deposit)
          );
        }
      }
    }

    if (!depositLock) {
      depositLock = true;

      try {
        await depositRequestHandler.consume(
          doc,
          request.deposit,
          request.userName
        );
      } catch (error) {
        LogUtils.log(CandyConstants.nodeJsServerName, error);
      }
      depositLock = false;
    }
  }
});

let payLock = false; //TODO remove lock from endpoint
app.post("/api/paymentRequest", async (req, res) => {
  // volano jako asynchroni metoda viz async(req, res)
  // request{
  // userName: "name",
  // candies: [{ id: candyId,
  //     name: candyName,
  //     price: candyPrice,
  //     type: candytype("cracker", "drinks", "other")}]
  // }

  const request = req.body;
  let requestError = [];

  request.candies.forEach((i) => {
    let error = validations.requestValidation(
      CandyConstants.nodeJsServerName,
      validationSchemes.candySchema,
      i
    );
    if (error === undefined) {
      error = validations.requestValidation(
        CandyConstants.nodeJsServerName,
        validationSchemes.userNameSchema,
        { userName: request.userName }
      );
    }
    if (error !== undefined) {
      requestError.push(error);
    }
  });

  if (requestError.length !== 0) {
    res
      .status(400)
      .send(
        apiUtils.serverNotAvailableResponse(requestError.join(", ").toString())
      );
  } else {
    let enrichResponse = paymentRequestHandler.enrich(
      -Math.abs(apiUtils.getCandiePrice(request.candies)),
      balanceDictionary.get(request.userName),
      doc,
      request.userName
    );
    res.send(JSON.stringify(enrichResponse));

    await clientsAccountCache.softUpdateUserBalance(
      //TODO call in enrich
      request.userName,
      -Math.abs(apiUtils.getCandiePrice(request.candies)),
      balanceDictionary
    );

    if (payLock) {
      for (let i = 0; i < 10; i++) {
        //TODO retry max to const
        await utils.delay(1000);
        if (!payLock) {
          break;
        }
        if (i === 9) {
          LogUtils.log(
            CandyConstants.nodeJsServerName,
            CandyErrors.paymentNotStored(
              request.userName,
              apiUtils.getCandiePrice(request.candies)
            )
          );
        }
      }
    }

    if (!payLock) {
      try {
        await paymentRequestHandler.consume(
          doc,
          request.candies,
          request.userName
        );
      } catch (error) {
        console.log(error);
      }
      payLock = false;
    }
  }
});

app.post("/api/QrCodeQuery", (req, res) => {
  const request = req.body;

  let error = validations.requestValidation(
    CandyConstants.nodeJsServerName,
    validationSchemes.qrCodeSchema,
    request
  );
  if (error !== undefined) {
    res.status(400).send(JSON.stringify(error));
  } else {
    const amount = request.price;
    const message = request.message;
    const urlApi = CandyConstants.qrCodeUrl(amount, message);

    res.send(JSON.stringify({ img: urlApi })); // RESPONSE MUSI BYT POSLANA JAKO OBJEK JSON !!!
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      CandyConstants.qrCodeLog(amount, message)
    );
  }
});

app.post("/api/priceList", (req, res) => {
  res.send(JSON.stringify(getCandyPriceList()));
});

app.get("/api/users", (req, res) => {
  res.send(JSON.stringify(users.productionUsers));
});
