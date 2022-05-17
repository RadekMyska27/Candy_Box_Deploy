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
const { DbUtils } = require("./utils/dbUtils");
const { PriceListUtils } = require("./utils/priceListUtils");
const { CandyMessages } = require("./constants/candyMessages");
const { Utils } = require("./utils/utils");
const { CandyErrors } = require("./constants/candyErrors");
const { docSetup } = require("./db/docSetup");
const { LogUtils } = require("./utils/logUtils");
const { ApiUtils } = require("./utils/apiUtils");

const { ExpressSetup } = require("./utils/expressSetup");
const { UsersAtDdUtils } = require("./utils/usersAtDdUtils");

const paymentRequestHandler = new PaymentRequestHandler();
const depositRequestHandler = new DepositRequestHandler();
const validations = new Validations();
const validationSchemes = new ValidationSchemes();
const clientsAccountCache = new ClientsAccountCacheUtils();
const expressSetup = new ExpressSetup();
const apiUtils = new ApiUtils();
const dbUtils = new DbUtils();
const utils = new Utils();
const priceListUtils = new PriceListUtils();
const usersUtils = new UsersAtDdUtils();

const doc = docSetup.doc;
const app = express();

//--NodeJs Server Init -----
expressSetup.setUpNodeJsServer(app, express);
//---------------

//------------- init users

let usersNames = [];
let userHistoryDictionary = new Map();
let balanceDictionary = new Map();

usersUtils.usersNames(doc).then((response) => {
  if (response.length !== 0) {
    usersNames = response;
  }

  //--Init database formulas
  dbUtils.setDbFormulas(doc, usersNames);
  //TODO handle error

  // for each user init history -> load users items from DB
  // for each user update balance cache after last user candy box started -> log

  let iterator = 0;

  usersNames.forEach((userName, index) => {
    setTimeout(
      () => userHistoryInit(iterator, userName, usersNames),
      index * CandyConstants.tenSecondToMilliseconds
    );
  });

  //--------------
});
//------------

//--INIT CACHE---//

function userHistoryInit(iterator, userName, usersNames) {
  iterator++;
  clientsAccountCache
    .initUserHistory(doc, userHistoryDictionary, userName)
    .then((r) => {
      if (r) {
        LogUtils.log(
          CandyConstants.nodeJsServerName,
          CandyMessages.userHistoryInit + userName
        );
        usersBalanceInit(userName);
      }
    });
  if (iterator === usersNames.length) {
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      CandyMessages.candyBoxStarted
    );
  }
}

function usersBalanceInit(userName) {
  clientsAccountCache
    .updateUsersBalances(doc, balanceDictionary, userName)
    .then((balanceResponse) => {
      //--CANDY BOX STARTED---//
      if (balanceResponse) {
        LogUtils.log(
          CandyConstants.nodeJsServerName,
          CandyMessages.userBalanceSuccessfullyUpdatedForUser + userName
        );
      }
    });
}

//-- Daily call users balance --//
setInterval(
  () => callUsersBalance(),
  CandyConstants.twentyFourHoursToMilliseconds
);

//TODO unit tests
function callUsersBalance() {
  LogUtils.log(
    CandyConstants.nodeJsServerName,
    CandyMessages.dailyCallOfUsersBalanceStarted
  );
  let actualUsersNames = usersNames;
  clientsAccountCache
    .getUsersBalances(doc, actualUsersNames)
    .then(async (response) =>
      response.length > 0
        ? await clientsAccountCache.setUsersDebt(
            depositRequestHandler,
            doc,
            response
          )
        : LogUtils.log(
            CandyConstants.nodeJsServerName,
            CandyMessages.dailyCallOfUsersBalanceFailed
          )
    );
}

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
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      "clientBalanceQuery called userName: " + request.userName
    );

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

  // TODO userName validations

  if (error !== undefined) {
    res.status(400).send(apiUtils.serverNotAvailableResponse(error));
  } else {
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      "depositRequest called userName: " +
        request.userName +
        " with  deposit " +
        request.deposit
    );

    let enrichResponse = depositRequestHandler.enrich(
      request.deposit,
      balanceDictionary.get(request.userName),
      doc,
      request.userName,
      userHistoryDictionary,
      usersNames
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
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      "paymentRequest called userName: " +
        request.userName +
        " with candies " +
        LogUtils.getCandiesToLog(request.candies)
    );

    let enrichResponse = paymentRequestHandler.enrich(
      request.candies,
      balanceDictionary.get(request.userName),
      doc,
      request.userName,
      userHistoryDictionary,
      usersNames
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
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      "QrCodeQuery called with " + request.message + " price " + request.price
    );
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

app.post("/api/users", async (req, res) => {
  //TODO make query?
  LogUtils.log(CandyConstants.nodeJsServerName, "users called ");

  const candyBoxUsers = await usersUtils.getUsers(doc);

  res.send(JSON.stringify(candyBoxUsers));
});

app.post("/api/favoriteItems", async (req, res) => {
  //TODO make query?

  const request = req.body;
  //TODO request validation

  let favorites = await priceListUtils.getFavoritesItems(doc, request.userName);

  //TODO error validation

  res.send(JSON.stringify(favorites));
});

app.post("/api/userHistory", async (req, res) => {
  //TODO make query?
  const request = req.body;

  let error = validations.requestValidation(
    CandyConstants.nodeJsServerName,
    validationSchemes.userNameSchema,
    { userName: request.userName }
  );

  if (error !== undefined) {
    res.status(400).send(apiUtils.serverNotAvailableResponse(error));
  }

  LogUtils.log(
    CandyConstants.nodeJsServerName,
    "userHistory with " + "userName: " + request.userName
  );

  res.send(JSON.stringify(userHistoryDictionary.get(request.userName)));
});

app.post("/api/queryItemsAtStore", async (req, res) => {
  //TODO request validation

  LogUtils.log(CandyConstants.nodeJsServerName, "queryItemsAtStore called ");

  let itemsAtStore = await priceListUtils.getCandiesAtStore(doc);

  res.send(JSON.stringify(itemsAtStore));
});

app.post("/api/queryItemsOutOfStock", async (req, res) => {
  //TODO request validation

  LogUtils.log(CandyConstants.nodeJsServerName, "queryItemsOutOfStock called ");

  let itemsOutOfStock = await dbUtils.getListOfItemsOutOfStore(doc);

  res.send(JSON.stringify(itemsOutOfStock));
});

app.post("/api/updateItemsAtStore", async (req, res) => {
  const request = req.body;

  //TODO request validation

  let error = validations.requestValidation(
    CandyConstants.nodeJsServerName,
    validationSchemes.candyToUpdateSchema,
    request
  );

  if (error !== undefined) {
    res.status(400).send(apiUtils.serverNotAvailableResponse(error));
  }

  LogUtils.log(CandyConstants.nodeJsServerName, "updateItemsAtStore called ");

  const candyStoreSheet = await dbUtils.getSheetByUserName(
    doc,
    CandyConstants.candyStoreName
  );
  error = validations.sheetExist(
    candyStoreSheet,
    CandyConstants.candyStoreName
  );

  if (error !== undefined) {
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      CandyErrors.googleSheetError + error
    );
    return error;
  }

  const updateItem = await dbUtils.updateItemAtStore(
    candyStoreSheet,
    request.id,
    request.amountToAdd,
    request.minAmountValue,
    request.maxAmountValue,
    request.price,
    request.name,
    false
  );

  res.send(JSON.stringify(updateItem));
});

app.post("/api/logInRequest", async (req, res) => {
  const request = req.body;

  //TODO request validation - min/max number of characters

  const userName = request.userName;
  const password = request.password;

  LogUtils.log(
    CandyConstants.nodeJsServerName,
    "logInRequest called userName: " + userName
  );

  let error = validations.usernameExist(userName, usersNames);

  if (error !== undefined) {
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      CandyErrors.userNameNotRecognized + userName
    );
    res.status(400).send(CandyErrors.userNameNotRecognized + userName);
  }

  const user = await usersUtils.getUserByName(doc, userName);

  if (user === undefined) {
    LogUtils.log(
      CandyConstants.nodeJsServerName,
      CandyErrors.userNameNotFindAtDb + userName
    );
    res.status(400).send(CandyErrors.userNameNotFindAtDb + userName);
  } else {
    let isLoginSuccess = validations.isPasswordValid(password, user.passWord);

    isLoginSuccess
      ? res.send(JSON.stringify(user))
      : res.status(400).send(CandyErrors.notValidPassword + userName);

    isLoginSuccess
      ? LogUtils.log(
          CandyConstants.nodeJsServerName,
          CandyMessages.userLogIn(userName, password)
        )
      : LogUtils.log(
          CandyConstants.nodeJsServerName,
          CandyErrors.userNotLogIn(userName, password)
        );
  }
});

app.post("/api/changePasswordRequest", async (req, res) => {
  const request = req.body;

  const userName = request.userName;
  const password = request.password;

  LogUtils.log(
    CandyConstants.nodeJsServerName,
    "changePasswordRequest called userName: " + userName
  );

  let error = validations.requestValidation(
    CandyConstants.nodeJsServerName,
    validationSchemes.PasswordSchema,
    request
  );

  let errorMessage = CandyErrors.enteredPasswordNotValid;

  if (error === undefined) {
    error = validations.usernameExist(userName, usersNames);
    errorMessage = CandyErrors.userNameNotRecognized + userName;
  }

  if (error !== undefined) {
    LogUtils.log(CandyConstants.nodeJsServerName, errorMessage);
    res.status(400).send(errorMessage);
  } else {
    let passwordUpdateError = await usersUtils.changeUserPassword(
      doc,
      userName,
      password
    );

    if (passwordUpdateError !== undefined) {
      LogUtils.log(
        CandyConstants.nodeJsServerName,
        CandyErrors.userPasswordNotUpdated
      );
      res.status(400).send(CandyErrors.userPasswordNotUpdated);
    } else {
      // let user = usersUtils.getUserByName(doc, userName);
      LogUtils.log(
        CandyConstants.nodeJsServerName,
        CandyMessages.userPasswordUpdated(userName)
      );
      res.send(JSON.stringify(CandyMessages.userPasswordUpdated(userName)));
    }
  }
});

app.post("/api/updateFavoriteItems", async (req, res) => {
  const request = req.body;

  const userId = request.userId;
  const userName = request.userName;
  const candyId = request.candyId;

  LogUtils.log(
    CandyConstants.nodeJsServerName,
    "updateFavoriteItems called userName: " + userName
  );

  //TODO request validations

  let userWithUpdatedFavorite = await usersUtils.updateUserFavoriteItem(
    doc,
    userId,
    userName,
    candyId
  );

  res.send(JSON.stringify(userWithUpdatedFavorite));
});
