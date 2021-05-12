const candyType = { cracker: "cracker", drinks: "drinks", other: "other" };

const shoppingList = document.getElementById("shopping_list");
const depositQr = document.getElementById("add_deposit_qr");
const paymentButtonMobile = document.getElementById("payment_btn_mobile");
const paymentDone = document.getElementById("pay_done");
const clearShopping = document.getElementById("clear_shopping");
const payQrImage = document.getElementById("QrImg");
const depositImage = document.getElementById("deposit_qr_img");
const depositValue = document.getElementById("deposit_value");
const userAccountButton = document.getElementById("user_account");
const userSelectButton = document.getElementById("user_select");
const userAccountBalance = document.getElementById("user_balance");
const userNameAccount = document.getElementById("user_name_account");
const userAccountClose = document.getElementById("user_account_close");
const signOutButton = document.getElementById("sign_out");
const depositButton = document.getElementById("add_deposit");
const userPayButton = document.getElementById("user_pay");
const payQrButton = document.getElementById("add_pay_qr");
const modalItems = document.getElementById("modal_items");
const modalPrice = document.getElementById("modal_price");
const userAccountPayBalance = document.getElementById("user_pay_balance");

let candyList = [];
let candiesToBuy = [];
let users = [];
let userName;
let userBalance;

initPriceList().then((r) => console.log("Price list incited"));

async function initPriceList() {
  priceListLoad();
  usersLoad();
}

function priceListLoad() {
  const url = "http://localhost:3000/api/priceList";
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
      candyList.forEach((i) => addElement(i.name, i.price, i.id, i.type));
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
  const url = "http://localhost:3000/api/users";
  fetch(url, {
    method: "GET",
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
  const url = "http://localhost:3000/api/clientBalanceQuery";
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
  const url = "http://localhost:3000/api/depositRequest";
  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      userName: userName,
      deposit: depositValue.value,
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
  const url = "http://localhost:3000/api/paymentRequest";
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
  if (userName !== "" && userName !== undefined && getPriceToPay() !== 0) {
    setupPaymentElements();
  } else if (getPriceToPay() > 0) {
    payQrButton.style.visibility = "visible";
  }
  if (userName !== undefined && userName !== "") {
    userBalanceLoad();
  }
  modalPaySetup();
});

userAccountButton?.addEventListener("click", function () {
  if (userName !== undefined) {
    userBalanceLoad();
  }
  modalUserAccountSetup();
});

paymentButtonMobile?.addEventListener("click", function () {
  modalPaySetup();
});

userPayButton?.addEventListener("click", function () {
  savePayment();
  clearPayElements();
});

paymentDone?.addEventListener("click", function () {
  clearShoppingList();
  payQrImage.src = "";
});

clearShopping?.addEventListener("click", function () {
  clearShoppingList();
});

depositQr?.addEventListener("click", function () {
  getDepositQrImageApi();
});

payQrButton?.addEventListener("click", function () {
  getQrImageApi();
});

signOutButton?.addEventListener("click", function () {
  clearSignOutElements();
});

depositButton?.addEventListener("click", function () {
  saveDeposit();
});

userAccountClose?.addEventListener("click", function () {
  clearDepositElementsWhenClose();
});

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

function setupPaymentElements() {
  userPayButton.removeAttribute("disabled");
  payQrButton.removeAttribute("disabled");
  userPayButton.style.visibility = "visible";
  payQrButton.style.visibility = "visible";
  userAccountPayBalance.style.visibility = "visible";
}

function clearPayElements() {
  userPayButton.setAttribute("disabled", "disabled");
  payQrButton.setAttribute("disabled", "disabled");
  payQrImage.src = "";
}

function stopLoader() {
  document.getElementById("QrCodeLoader");
  {
    if (document.getElementById("QrCodeLoader") !== null) {
      document.getElementById("QrCodeLoader").style.display = "none";
    }
  }
}

function startBalanceLoader() {
  if (document.getElementById("loader_progress") !== null) {
    document.getElementById("loader_progress").style.display;
  }
}

function stopBalanceLoader() {
  if (document.getElementById("loader_progress") !== null) {
    document.getElementById("loader_progress").style.display = "none";
  }
}

function clearSignOutElements() {
  userBalance = undefined;
  userName = "";
  userSelectButton.innerHTML = "Uživatel";
  userAccountButton.style.visibility = "hidden";
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

  userPayButton.style.visibility = "hidden";
  payQrButton.style.visibility = "hidden";
  userAccountPayBalance.style.visibility = "hidden";
}

// modal elements setup - not modul init!!
function modalPaySetup() {
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

function setDepositUserBalance() {
  userAccountBalance.innerHTML = "Zustatek: " + userBalance + ",-";
}

function setPayUserBalance() {
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
  userAccountBalance.style.color = "green";
  userAccountBalance.style.fontWeight = "bold";
  userAccountBalance.innerHTML =
    "Zustatek: + " + depositValue.value + " = " + userBalance + ",-";
  setTimeout(function () {
    userAccountBalance.style.color = "black";
    userAccountBalance.style.fontWeight = "normal";
    setDepositUserBalance();
  }, 3000);
}

function updatePayUserBalance() {
  userAccountPayBalance.style.color = "green";
  userAccountPayBalance.style.fontWeight = "bold";
  userAccountPayBalance.innerHTML =
    "Zustatek: - " + getPriceToPay() + " = " + userBalance + ",-";
  setTimeout(function () {
    userAccountPayBalance.style.color = "black";
    userAccountPayBalance.style.fontWeight = "normal";
    setPayUserBalance();
  }, 3000);
}

function deleteDepositValue() {
  depositValue.value = undefined;
}

function modalUserAccountSetup() {
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

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}

function clearDepositElementsWhenClose() {
  userBalance = undefined;
  depositValue.value = undefined;
  depositImage.src = "";
}
