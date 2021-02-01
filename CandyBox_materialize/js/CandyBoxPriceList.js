const candyType = { cracker: "cracker", drinks: "drinks", other: "other" };

const button = document.getElementById("post_btn");
const shoppingList = document.getElementById("shopping_list");
const paymentButtonMobile = document.getElementById("payment_btn_mobile");
const paymentDone = document.getElementById("pay_done");
const clearShopping = document.getElementById("clear_shopping");
const image = document.getElementById("QrImg");

var candyList = [];
var candiesToBuy = [];

intPriceList();

async function intPriceList() {
  var url = "http://localhost:3000/api/priceList";
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
      setAddCandyListener();
      setDeleteCandyListener();
      candiesListToConsole();
      setCandyImageEffectOnClick();
    })
    .catch(function (error) {
      console.log(error);
    });
}

function addElement(name, price, id, type) {
  // create a new div element
  const containerDiv = document.createElement("div");
  const rowDiv = document.createElement("div");
  const colDiv = document.createElement("div");
  const cardDiv = document.createElement("div");
  const cardImageDiv = document.createElement("div");
  const cardContentDiv = document.createElement("div");
  const cardImage = document.createElement("img");
  const cardTitleSpan = document.createElement("div");
  const cardActionDiv = document.createElement("div");
  const action = document.createElement("a");
  const cardAddButton = document.createElement("a");
  const cardDeleteButton = document.createElement("a");

  // add tags to elements
  containerDiv.className = "container";
  rowDiv.className = "row";
  colDiv.className = "col s4";
  cardDiv.className = "card";
  cardTitleSpan.className = "card-title center";

  cardImageDiv.className = "card-image responsive-img";
  cardImageDiv.id = "candyImage_" + id.toString();
  cardImage.src = "image/" + name.toString() + ".jpg";
  cardActionDiv.className = "card-action";

  cardContentDiv.id = "content" + id.toString();
  cardContentDiv.className = "card-content center";

  cardAddButton.id = "add_" + id.toString();
  cardAddButton.className =
    "waves-effect waves-light btn-small light-green darken-4";
  cardAddButton.innerText = "Přidat";

  cardDeleteButton.id = "delete_" + id.toString();
  cardDeleteButton.className = "waves-effect waves-light btn-small brown";
  cardDeleteButton.innerText = "Odebrat";

  // and give it some content
  const ContentName = document.createTextNode(name + " ");
  const ContentPrice = document.createTextNode(price.toString() + ",-");
  const ContentText = document.createTextNode("V KOŠIKU: 0 ks");

  // add the text node to the newly created div
  cardTitleSpan.appendChild(ContentName);
  cardTitleSpan.appendChild(ContentPrice);
  cardContentDiv.appendChild(ContentText);

  // zanořeni od vnitřnich elementu
  cardImageDiv.append(cardImage);
  cardActionDiv.append(cardAddButton);
  cardActionDiv.append(cardDeleteButton);
  cardDiv.append(cardImageDiv);
  cardDiv.append(cardTitleSpan);
  cardDiv.append(cardContentDiv);
  cardDiv.append(cardActionDiv);
  colDiv.append(cardDiv);
  rowDiv.append(colDiv);

  // add the newly created element and its content into the DOM
  // const gridRowDiv = document.getElementById("");

  switch (type) {
    case candyType.cracker:
      const rowTabCracker = document.getElementById("rowTab_cracker");
      rowTabCracker.append(colDiv);
      break;

    case candyType.drinks:
      const rowTabDrinks = document.getElementById("rowTab_drinks");
      rowTabDrinks.append(colDiv);
      break;

    case candyType.other:
      const rowTabOther = document.getElementById("rowTab_other");
      rowTabOther.append(colDiv);
      break;

    default:
      console.log("ERROR no candy type loaded");
      break;
  }
}

shoppingList.addEventListener("click", function () {
  modalElementsSetup();
});

paymentButtonMobile.addEventListener("click", function () {
  modalElementsSetup();
});

paymentDone.addEventListener("click", function () {
  cleareSchoppingList();
  image.src = "";
});

clearShopping.addEventListener("click", function () {
  cleareSchoppingList();
});

// modal elements setup - not modul init!!
function modalElementsSetup() {
  getQrImageApi();

  var modalItems = document.getElementById("modal_items");
  modalItems.innerHTML = "Vybrané položky: " + getCandiesNamesToPay();

  var modalPrice = document.getElementById("modal_price");
  modalPrice.innerHTML =
    "Celkova cena za vybrané položky " + getPriceToPay() + ",-";
}

function stopLoader() {
  console.log("stop");
  document.getElementById("QrCodeLoader").style.display = "none";
}

function getQrImageApi() {
  var url = "http://localhost:3000/api/nodeJsQR";

  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      price: getPriceToPay(),
      message: getCandiesNamesToPay(),
    }),
  })
    .then(async function (response) {
      var result = await response.json();
      if (getPriceToPay() !== 0) {
        image.src = result.img;
        stopLoader();
      }
    })
    .catch(function (error) {
      console.log(error);
      stopLoader();
    });
}

function setCandyImageEffectOnClick() {
  for (let i = 0; i < candyList.length; i++) {
    const candyImage = document.getElementById("candyImage_" + i.toString());

    candyImage.addEventListener("click", function () {
      candyImage.style.opacity = "0.3";
      setTimeout(() => {
        candyImage.style.opacity = "1";
      }, 200);
    });
  }
}

function setAddCandyListener() {
  for (let i = 0; i < candyList.length; i++) {
    const addButton = document.getElementById("add_" + i.toString());
    const candyImage = document.getElementById("candyImage_" + i.toString());

    addItemListener(addButton, i);
    addItemListener(candyImage, i);
  }
}

function addItemListener(addElement, i) {
  addElement.addEventListener("click", function () {
    candyList.forEach((candy) => {
      if (candy.id === i) {
        candiesToBuy.push(candy);
        setShoppingListPrice();
        setNumberOfCandies(i);
      }
    });
  });
}

function setDeleteCandyListener() {
  for (let i = 0; i < candyList.length; i++) {
    var deleteButton = document.getElementById("delete_" + i.toString());

    deleteButton.addEventListener("click", function () {
      var candyIndex = candiesToBuy.findIndex((candy) => candy.id === i);
      if (candyIndex !== -1) {
        candiesToBuy.splice(candyIndex, 1);
        setShoppingListPrice();
        setNumberOfCandies(i);
      }
    });
  }
}

function setNumberOfCandies(id) {
  var candiesNumber = 0;

  candiesToBuy.forEach((candy) => {
    if (candy.id === id) {
      candiesNumber++;
    }
  });

  var cardContent = document.getElementById("content" + id);
  cardContent.innerHTML = "V KOŠIKU: " + candiesNumber + " ks";
}

function setShoppingListPrice() {
  shoppingList.innerHTML = "KOŠÍK" + "(" + getPriceToPay().toString() + ",-)";
}

function getPriceToPay() {
  var price = 0;
  candiesToBuy.forEach((candy) => {
    price += candy.price;
  });
  return price;
}

function getCandiesNamesToPay() {
  var items = [];
  candiesToBuy.forEach((candy) => {
    items.push(candy.name);
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

function cleareSchoppingList() {
  candiesToBuy = [];
  setShoppingListPrice();
  candyList.forEach((candy) => {
    setNumberOfCandies(candy.id);
  });
}

// MODAL INIT
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".modal");
  var options = { dismissible: false };
  var instances = M.Modal.init(elems, options);
});

//NAVBAR INIT
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems);
});

// Collapsibles INIT
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".collapsible");
  var instances = M.Collapsible.init(elems);
});
