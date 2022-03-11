const candyType = {
  cracker: "cracker",
  drinks: "drinks",
  other: "other",
  favorite: "favorite",
};

const shoppingList = document.getElementById("shopping_list");
const depositQrButton = document.getElementById("add_deposit_qr");
const paymentButtonMobile = document.getElementById("payment_btn_mobile");
const userLogInButtonMobile = document.getElementById("users_btn_mobile");
const userAccountButtonMobile = document.getElementById(
  "users_account_btn_mobile"
);
const paymentDoneButton = document.getElementById("pay_done");
const clearShopping = document.getElementById("clear_shopping");
const payQrImage = document.getElementById("QrImg");
const depositQrImage = document.getElementById("deposit_qr_img");
const depositValueInput = document.getElementById("deposit_value");
const userAccountButton = document.getElementById("user_account");
const userSelectButton = document.getElementById("user_select");
const userAccountBalance = document.getElementById("user_balance");
const userNameAccount = document.getElementById("user_name_account");
const userAccountClose = document.getElementById("user_account_close");
const signOutButton = document.getElementById("sign_out");
const depositCashButton = document.getElementById("add_deposit");
const userPayButton = document.getElementById("user_pay");
const payQrButton = document.getElementById("add_pay_qr");
const modalItems = document.getElementById("modal_items");
const modalPrice = document.getElementById("modal_price");
const userAccountPayBalance = document.getElementById("user_pay_balance");
const schoppingContinueButton = document.getElementById("pay_continue");
const redirectAdminPageButton = document.getElementById("redirect_adminPage");
const userNameInputValue = document.getElementById("userName_value");
const passwordInputValue = document.getElementById("password_value");
const userLogInButton = document.getElementById("user_logIn_button");
const logInConfirmButton = document.getElementById("logIn_confirm_button");
const logInGeneralError = document.getElementById("logIn_general_error");
const loaderLogIn = document.getElementById("loader_logIn");
const userLogInCloseButton = document.getElementById("user_logIn_close");
const newPasswordInputValue = document.getElementById("new_password_value");
const userNewPasswordStatusLabel = document.getElementById(
  "user_new_password_error"
);
const confirmNewPasswordButton = document.getElementById(
  "confirm_new_password"
);
const loaderChangePassword = document.getElementById("loader_change_password");
const balanceLoader = document.getElementById("loader_balance");

let candyList = [];
// let favoriteCandyList = [];
let userHistoryItems = [];
let candiesToBuy = [];
let users = [];
let userName;
let userPassword;
let userId;
let userBalance;
let favoriteItems = [];

const urlIp = "localhost";

initPriceList().then((r) => console.log("Price list incited"));

async function initPriceList() {
  priceListLoad();
  usersLoad();
}

function priceListLoad() {
  const url = "http://" + urlIp + ":3000/api/queryItemsAtStore";
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((responseData) => {
      //  price list items init !!!!!!!!
      candyList = responseData;
      candyList.forEach((i) => {
        addPriceListItem(capitalizeFirstLetter(i.name), i.price, i.id, i.type);
      });
      // candiesListToConsole();
      priceListItemSettings(candyList);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function userHistoryLoad() {
  const url = "http://" + urlIp + ":3000/api/userHistory"; //TODO query
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      userName: userName,
    }),
  })
    .then((response) => response.json())
    .then((responseData) => {
      userHistoryItems = responseData.slice(-10);
      userHistoryItems.forEach((i) =>
        createUserHistoryItem(
          i.lastUpdateDate,
          capitalizeFirstLetter(i.name),
          i.price
        )
      );
    })
    .catch(function (error) {
      console.log(error);
    });
}

// function favoriteItemsLoad() {
//   const url = "http://" + urlIp + ":3000/api/favoriteItems"; //TODO query
//   fetch(url, {
//     method: "POST",
//     headers: new Headers({
//       "content-type": "application/json",
//     }),
//     body: JSON.stringify({
//       userName: userName,
//     }),
//   })
//     .then((response) => response.json())
//     .then((responseData) => {
//       favoriteCandyList = responseData;
//       favoriteCandyList.forEach((i) =>
//         addPriceListItem(capitalizeFirstLetter(i.name), i.price, i.id, i.type)
//       );
//       // favoriteListToConsole();
//       priceListItemSettings(favoriteCandyList);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }

function usersLoad() {
  const url = "http://" + urlIp + ":3000/api/users"; //TODO query
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((responseData) => {
      users = responseData;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function userBalanceLoad() {
  startBalanceLoader();
  const url = "http://" + urlIp + ":3000/api/clientBalanceQuery"; // http://localhost:3000/api/clientBalanceQuery
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      userName: userName,
    }),
  })
    .then(async (responseBalance) => {
      userBalance = await responseBalance.json();
      stopBalanceLoader();
      isPayButtonDisabled();
    })
    .catch(function (error) {
      console.log(error);
      stopBalanceLoader();
    });
}

function saveDeposit() {
  const url = "http://" + urlIp + ":3000/api/depositRequest"; //http://localhost:3000/api/depositRequest
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      userName: userName,
      deposit: depositValueInput.value,
    }),
  })
    .then(async (responseDeposit) => {
      let response = await responseDeposit.json();

      if (typeof response === "number") {
        userBalance = response;
        updateUserBalance("deposit");
        deleteDepositValue();
      } else {
        console.log(response);
      }
      deleteUserHistory();
      userHistoryLoad();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function savePayment() {
  const url = "http://" + urlIp + ":3000/api/paymentRequest"; //http://localhost:3000/api/paymentRequest
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      userName: userName,
      candies: candiesToBuy,
    }),
  })
    .then(async (responsePayment) => {
      let response = await responsePayment.json();

      if (typeof response === "number") {
        userBalance = response;
        updateUserBalance("pay");
      } else {
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

function userLogIn() {
  startLogInLoader();
  const url = "http://" + urlIp + ":3000/api/logInRequest";
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      userName: userNameInputValue.value.toLowerCase(),
      password: passwordInputValue.value,
    }),
  })
    .then(async (responseLogIn) => {
      let response = await responseLogIn.json();

      userName = response.name;
      userPassword = response.passWord;
      userId = response.id;
      favoriteItems = response.favoriteItems;

      userAccountButtonSetup();
      hideLogInButton();
      shouldBeAdminPageButtonVisible();

      favoriteItems.forEach((favoriteCandyId) => {
        tryMoveCandyToFavoriteItems(candyList, favoriteCandyId);
      });

      closeLogInModal();
    })
    .catch(function (error) {
      displayLogInError(true);
      console.error(error.message);

      stopLogInLoader();
    });
}

function changeUserPassword() {
  startPasswordLoader();
  const url = "http://" + urlIp + ":3000/api/changePasswordRequest";
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      userName: userName,
      password: newPasswordInputValue.value,
    }),
  })
    .then(async (responsePasswordChanged) => {
      let response = await responsePasswordChanged.json();

      displayChangePasswordStatus(false);
      stopPasswordLoader();
    })
    .catch(function (error) {
      displayChangePasswordStatus(true);
      console.error(error.message);
      stopPasswordLoader();
    });
}

function updateUsersFavoriteItems(candyToUpdateId, list) {
  disableFavoriteButtons(list);
  const url = "http://" + urlIp + ":3000/api/updateFavoriteItems";
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      userId: userId,
      userName: userName,
      candyId: candyToUpdateId,
    }),
  })
    .then(async (responseFavoriteItemsChanged) => {
      let response = await responseFavoriteItemsChanged.json();

      favoriteItems = response.favoriteItems;

      favoriteItems.forEach((favoriteCandyId) => {
        tryMoveCandyToFavoriteItems(candyList, favoriteCandyId);
      });
      enableFavoriteButtons(list);
    })
    .catch(function (error) {
      enableFavoriteButtons(list);
      console.error(error.message);
    });
}

function priceListItemSettings(list) {
  setAddCandyListener(list);
  setDeleteCandyListener(list);
  setCandyImageEffectOnClick(list);
  setFavoriteListener(list);
}

shoppingList?.addEventListener("click", function () {
  setupPaymentModalElements();
});

userAccountButton?.addEventListener("click", function () {
  setupUserAccountModal();
  shouldBeAdminPageButtonVisible();
});

userAccountButtonMobile?.addEventListener("click", function () {
  setupUserAccountModal();
  shouldBeAdminPageButtonVisible();
});

paymentButtonMobile?.addEventListener("click", function () {
  setupPaymentModalElements();
});

userPayButton?.addEventListener("click", function () {
  savePayment();
  setPayElementsWhenPay();
});

payQrButton?.addEventListener("click", function () {
  getQrImageApi();
  paymentDoneButton.removeAttribute("disabled");
});

paymentDoneButton?.addEventListener("click", function () {
  clearShoppingList();
  setDefaultPayModalElementsWhenClose();
});

schoppingContinueButton?.addEventListener("click", function () {
  payQrImage.src = "";
});

clearShopping?.addEventListener("click", function () {
  clearShoppingList();
});

signOutButton?.addEventListener("click", function () {
  setElementsDefaultWhenSignOut();
});

userAccountClose?.addEventListener("click", function () {
  depositQrImage.src = "";
  clearDepositElementsWhenClose();
});

depositCashButton?.addEventListener("click", function () {
  disableDepositButtons();
  saveDeposit();
});

depositQrButton?.addEventListener("click", function () {
  disableDepositButtons();
  getDepositQrImageApi();
  saveDeposit();
});

logInConfirmButton?.addEventListener("click", function () {
  displayLogInError(false);
  userLogIn();
});

depositValueInput?.addEventListener("input", function () {
  tryUpdateDisabledAttributeQrButton();
});

depositValueInput?.addEventListener("focusin", function () {
  enableDepositButtons();
  depositQrImage.src = "";
});

confirmNewPasswordButton?.addEventListener("click", function () {
  hideChangePassWordStatus();
  changeUserPassword();
});

userNameInputValue.addEventListener("keypress", function (event) {
  ClearErrorAndCallLogInRequest(event);
});

passwordInputValue.addEventListener("keypress", function (event) {
  ClearErrorAndCallLogInRequest(event);
});

function ClearErrorAndCallLogInRequest(event) {
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    displayLogInError(false);
    userLogIn();
  }
}

function disableDepositButtons() {
  depositCashButton.setAttribute("disabled", "disabled");
  depositQrButton.setAttribute("disabled", "disabled");
}

function enableDepositButtons() {
  depositCashButton.removeAttribute("disabled");
  tryUpdateDisabledAttributeQrButton();
}

function setupUserAccountModal() {
  if (userName !== undefined) {
    userBalanceLoad();
    userHistoryLoad();
  }

  setupUserAccountModalElements();
}

function setDefaultPayModalElementsWhenClose() {
  payQrImage.src = "";
  userBalance = undefined;
  if (
    userPayButton !== null &&
    payQrButton !== null &&
    userAccountPayBalance !== null
  ) {
    userPayButton.style.visibility = "hidden";
    payQrButton.style.visibility = "hidden";
    userAccountPayBalance.style.visibility = "hidden";
  }
}

function displayLogInError(isError) {
  logInGeneralError.style.visibility = isError ? "visible" : "hidden";
}

function displayChangePasswordStatus(isError) {
  userNewPasswordStatusLabel.innerHTML = isError
    ? "Chyba, heslo musí mít min 2 a max 100 znaků"
    : "Heslo bylo změněno";
  userNewPasswordStatusLabel.style.color = isError ? "red" : "green";
  userNewPasswordStatusLabel.style.visibility = "visible";
}

function hideChangePassWordStatus() {
  if (userNewPasswordStatusLabel !== null) {
    userNewPasswordStatusLabel.style.visibility = "hidden";
  }
}

function startLogInLoader() {
  loaderLogIn.style.visibility = "visible";
}

function stopLogInLoader() {
  loaderLogIn.style.visibility = "hidden";
}

function startPasswordLoader() {
  loaderChangePassword.style.visibility = "visible";
}

function stopPasswordLoader() {
  loaderChangePassword.style.visibility = "hidden";
}

function setCandiesToBuy(candies) {
  candiesToBuy = candies;
}

function closeLogInModal() {
  userLogInCloseButton.click();
}

function addCandieToBuy({ id, name, price, type }) {
  candiesToBuy.push({
    id: id,
    name: name,
    price: price,
    type: type,
  });
}

function getCandyList() {
  return candyList;
}

function getCandiesToBuy() {
  return candiesToBuy;
}

function setupDefaultPaymentElements() {
  userPayButton.removeAttribute("disabled");
  payQrButton.removeAttribute("disabled");
  paymentDoneButton.setAttribute("disabled", "disabled");
  userPayButton.style.visibility = "visible";
  payQrButton.style.visibility = "visible";
  userAccountPayBalance.style.visibility = "visible";
  schoppingContinueButton.removeAttribute("disabled");
}

function setPayElementsWhenPay() {
  userPayButton.setAttribute("disabled", "disabled");
  payQrButton.setAttribute("disabled", "disabled");
  paymentDoneButton.removeAttribute("disabled");
  payQrImage.src = "";
  schoppingContinueButton.setAttribute("disabled", "disabled");
}

function isPayButtonDisabled() {
  if (!isUserBalanceValid()) {
    userPayButton.setAttribute("disabled", "disabled");
  }
}

function isUserBalanceValid() {
  return userBalance >= getPriceToPay();
}

function startBalanceLoader() {
  balanceLoader.style.visibility = "visible";
}

function stopBalanceLoader() {
  balanceLoader.style.visibility = "hidden";
}

function stopLoader() {
  document.getElementById("QrCodeLoader");
  {
    if (document.getElementById("QrCodeLoader") !== null) {
      document.getElementById("QrCodeLoader").style.display = "none";
    }
  }
}

function setElementsDefaultWhenSignOut() {
  userBalance = undefined;
  userName = "";
  userAccountButton.style.visibility = "hidden";
  userAccountButtonMobile.style.visibility = "hidden";
  userLogInButton.style.visibility = "visible";

  shouldBeAdminPageButtonVisible();
}

function generateCandyNumberLabel(originalId, candiesNumber) {
  if (document.getElementById("content" + originalId) !== null) {
    let cardContent = document.getElementById("content" + originalId);
    if (cardContent !== null) {
      cardContent.innerHTML = "V KOŠIKU: " + candiesNumber + " ks";
    }
  }
}

function setNumberOfCandies(id) {
  let candiesNumber = 0;
  let originalId = undefined;

  // favoriteCandyList.forEach((favorite) => {
  //   if (favorite.originalId === id) {
  //     originalId = favorite.id;
  //   }
  // });

  candiesToBuy.forEach((candy) => {
    if (candy.id === id && originalId === undefined) {
      originalId = candy.originalId;
    }

    if (candy.id === id || candy.id === originalId) {
      candiesNumber++;
    }
  });

  if (originalId !== undefined) {
    generateCandyNumberLabel(originalId, candiesNumber);
    generateCandyNumberLabel(id, candiesNumber);
  } else {
    generateCandyNumberLabel(id, candiesNumber);
  }

  return candiesNumber;
}

function setShoppingListPrice() {
  if (shoppingList !== null) {
    shoppingList.innerHTML = "KOŠÍK" + "(" + getPriceToPay().toString() + ",-)";
  }
}

function getPriceToPay() {
  let price = 0;
  candiesToBuy.forEach((candy) => {
    price += candy.price;
  });

  return price;
}

function getCandiesNamesToPay() {
  let items = [];
  candiesToBuy.forEach((candy) => {
    items.push(candy.name.replace("_", " "));
  });

  return items.join(", ");
}

function candiesListToConsole() {
  candyList.forEach((candy) => {
    console.log(
      "id: " +
        candy.id +
        ", Name: " +
        candy.name +
        ", Price: " +
        candy.price +
        " Type: " +
        candy.type
    );
  });
}

// function favoriteListToConsole() {
//   favoriteCandyList.forEach((candy) => {
//     console.log(
//       "id: " +
//         candy.id +
//         ", Name: " +
//         candy.name +
//         ", Price: " +
//         candy.price +
//         " Type: " +
//         candy.type
//     );
//   });
// }

function setSelectedCandiesToDisplay() {
  if (modalItems !== null) {
    modalItems.innerHTML = "Vybrané položky: " + getCandiesNamesToPay();
  }
}

function setCandiesPriceToDisplay() {
  if (modalPrice !== null) {
    modalPrice.innerHTML =
      "Celkova cena za vybrané položky " + getPriceToPay() + ",-";
  }
}

function clearShoppingList() {
  candiesToBuy = [];
  setShoppingListPrice();
  candyList.forEach((candy) => {
    setNumberOfCandies(candy.id);
  });
  setSelectedCandiesToDisplay();
  setCandiesPriceToDisplay();
}

// modal elements setup - not modul init!!
function setupPaymentModalElements() {
  if (userName !== "" && userName !== undefined && getPriceToPay() > 0) {
    setupDefaultPaymentElements();
  } else if (getPriceToPay() > 0) {
    payQrButton.style.visibility = "visible";
  }
  if (userName !== undefined && userName !== "") {
    userBalanceLoad();
  }

  if (userBalance === undefined) {
    let timer = setInterval(() => {
      if (userBalance !== undefined) {
        setPayUserBalance(false);
      }
    }, 1000); // TODO to constant
    setTimeout(() => {
      clearInterval(timer);
    }, 10000); // TODO to constant
  } else {
    setPayUserBalance(false);
  }

  if (getPriceToPay() === 0) {
    stopLoader();
    return;
  }

  setSelectedCandiesToDisplay();
  setCandiesPriceToDisplay();
}

function setupUserAccountModalElements() {
  tryUpdateDisabledAttributeQrButton();
  userNameAccount.innerHTML = "Uživatel: " + capitalizeFirstLetter(userName);

  if (userBalance === undefined) {
    let timerId = setInterval(() => {
      if (userBalance !== undefined) {
        setDepositUserBalance();
      }
    }, 1000); // TODO to constant
    setTimeout(() => {
      clearInterval(timerId);
    }, 10000); // TODO to constant
  } else {
    setDepositUserBalance();
  }
}

function setDepositUserBalance() {
  setBalanceLabelColorAndFontDefault(userAccountBalance);
  userAccountBalance.innerHTML = "Zustatek: " + userBalance + ",-";
}

function setPayUserBalance(isAfterPay) {
  setBalanceLabelColorAndFontDefault(userAccountPayBalance);
  if (isUserBalanceValid() || isAfterPay) {
    userAccountPayBalance.innerHTML = "Zustatek: " + userBalance + ",-";
  } else {
    userAccountPayBalance.style.color = "red";
    userAccountPayBalance.innerHTML =
      "NENI DOST KREDITU NA NAKUP! ZUSTATEK: " + userBalance + ",-";
  }
}

function updateUserBalance(targetModal) {
  //TODO refactoring to solid
  switch (targetModal) {
    case "deposit":
      updateDepositUserBalance();
      break;
    case "pay":
      updatePayUserBalance();
      break;
  }
}

function updateDepositUserBalance() {
  setBalanceLabelColorAndFontUpdate(userAccountBalance);
  userAccountBalance.innerHTML =
    "Zustatek: + " + depositValueInput.value + " = " + userBalance + ",-";
  setTimeout(function () {
    setBalanceLabelColorAndFontDefault(userAccountBalance);
    setDepositUserBalance();
  }, 3000);
}

function updatePayUserBalance() {
  setBalanceLabelColorAndFontUpdate(userAccountPayBalance);
  userAccountPayBalance.innerHTML =
    "Zustatek: - " + getPriceToPay() + " = " + userBalance + ",-";
  setTimeout(function () {
    setBalanceLabelColorAndFontDefault(userAccountPayBalance);
    setPayUserBalance(true);
  }, 3000);
}

function setBalanceLabelColorAndFontUpdate(balanceLabel) {
  balanceLabel.style.color = userBalance > 0 ? "green" : "red";
  balanceLabel.style.fontWeight = "bold";
}

function setBalanceLabelColorAndFontDefault(balanceLabel) {
  balanceLabel.style.color = userBalance > 0 ? "black" : "red";
  balanceLabel.style.fontWeight = userBalance > 0 ? "normal" : "bold";
}

function deleteDepositValue() {
  depositValueInput.value = undefined;
}

function tryUpdateDisabledAttributeQrButton() {
  depositValueInput.value > 0 && depositValueInput.value !== undefined
    ? depositQrButton.removeAttribute("disabled")
    : depositQrButton.setAttribute("disabled", "disabled");
}

function clearDepositElementsWhenClose() {
  userBalance = undefined;
  depositValueInput.value = undefined;
  depositQrImage.src = "";
  userNewPasswordStatusLabel.style.visibility = "hidden";
  deleteUserHistory();
}
