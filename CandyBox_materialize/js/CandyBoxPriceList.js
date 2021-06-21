const candyType = { cracker: "cracker", drinks: "drinks", other: "other" };

const shoppingList = document.getElementById("shopping_list");
const depositQrButton = document.getElementById("add_deposit_qr");
const paymentButtonMobile = document.getElementById("payment_btn_mobile");
const userSelectButtonMobile = document.getElementById("users_btn_mobile");
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

let candyList = [];
let candiesToBuy = [];
let users = [];
let userName;
let userBalance;
const urlIp = "192.168.1.137";

initPriceList().then((r) => console.log("Price list incited"));

async function initPriceList() {
  priceListLoad();
  usersLoad();
}

function priceListLoad() {
  const url = "http://" + urlIp + ":3000/api/priceList"; // http://localhost:3000/api/priceList
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
      candyList.forEach((i) =>
        addElement(capitalizeFirstLetter(i.name), i.price, i.id, i.type)
      );
      users.forEach((i) => addUserToDropDown(i.id, i.name));
      setAddCandyListener();
      setDeleteCandyListener();
      candiesListToConsole();
      setCandyImageEffectOnClick();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function usersLoad() {
  const url = "http://" + urlIp + ":3000/api/users"; //http://localhost:3000/api/users
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
  })
    .then((response) => response.json())
    .then((responseData) => {
      users = responseData;
      users.forEach((i) => addUserToDropDown(i.id, i.name));
      setUserSelectorListener();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function userBalanceLoad() {
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
    })
    .catch(function (error) {
      console.log(error);
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
        console.log(response);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

shoppingList?.addEventListener("click", function () {
  setupPaymentModalElements();
});

userAccountButton?.addEventListener("click", function () {
  setupUserAccountModal();
});

userAccountButtonMobile?.addEventListener("click", function () {
  setupUserAccountModal();
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

depositValueInput.addEventListener("input", function () {
  tryUpdateDisabledAttributeQrButton();
});

depositValueInput.addEventListener("focusin", function () {
  enableDepositButtons();
  depositQrImage.src = "";
});

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

function setCandiesToBuy(candies) {
  candiesToBuy = candies;
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

function startBalanceLoader() {
  if (document.getElementById("loader_progress") !== null) {
    document.getElementById("loader_progress").style.display;
  }
}

function stopLoader() {
  document.getElementById("QrCodeLoader");
  {
    if (document.getElementById("QrCodeLoader") !== null) {
      document.getElementById("QrCodeLoader").style.display = "none";
    }
  }
}

function stopBalanceLoader() {
  if (document.getElementById("loader_progress") !== null) {
    document.getElementById("loader_progress").style.display = "none";
  }
}

function setElementsDefaultWhenSignOut() {
  userBalance = undefined;
  userName = "";
  userSelectButton.innerHTML = "Uživatel";
  userSelectButtonMobile.innerHTML = "Uživatel";
  userAccountButton.style.visibility = "hidden";
  userAccountButtonMobile.style.visibility = "hidden";
}

function setNumberOfCandies(id) {
  let candiesNumber = 0;

  candiesToBuy.forEach((candy) => {
    if (candy.id === id) {
      candiesNumber++;
    }
  });

  if (document.getElementById("content" + id) !== null) {
    let cardContent = document.getElementById("content" + id);
    if (cardContent !== null) {
      cardContent.innerHTML = "V KOŠIKU: " + candiesNumber + " ks";
    }
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
      "id: " + candy.id + ", Name: " + candy.name + ", Price: " + candy.price
    );
  });
}

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
        setPayUserBalance();
      }
    }, 1000); // TODO to constant
    setTimeout(() => {
      clearInterval(timer);
    }, 10000); // TODO to constant
  } else {
    setPayUserBalance();
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
    startBalanceLoader();
    let timerId = setInterval(() => {
      if (userBalance !== undefined) {
        stopBalanceLoader();
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

function setPayUserBalance() {
  setBalanceLabelColorAndFontDefault(userAccountPayBalance);
  userAccountPayBalance.innerHTML = "Zustatek: " + userBalance + ",-";
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
    setPayUserBalance();
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

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function clearDepositElementsWhenClose() {
  userBalance = undefined;
  depositValueInput.value = undefined;
  depositQrImage.src = "";
}
