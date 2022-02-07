function addPriceListItem(name, price, id, type) {
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
  // get image for candy from folder image
  cardImage.src = "image/" + name.toString() + ".jpg";
  cardActionDiv.className = "card-action";
  cardActionDiv.style.alignContent = "center";

  cardContentDiv.id = "content" + id.toString();
  cardContentDiv.className = "card-content center";

  cardAddButton.id = "add_" + id.toString();
  cardAddButton.className =
    "waves-effect waves-light btn-small light-green darken-4";
  cardAddButton.innerText = "Přidat";

  cardDeleteButton.id = "delete_" + id.toString();
  cardDeleteButton.className = "waves-effect waves-light btn-small brown";
  cardDeleteButton.innerText = "Odebrat";
  cardDeleteButton.style.marginLeft = "5px";

  // and give it some content

  const ContentName = document.createTextNode(name.replace("_", " ") + " ");
  const ContentPrice = document.createTextNode(price.toString() + ",-");
  const ContentText = document.createTextNode("V KOŠIKU: 0 ks");

  // add the text node to the newly created div
  cardTitleSpan.appendChild(ContentName);
  cardTitleSpan.appendChild(ContentPrice);
  cardContentDiv.appendChild(ContentText);

  // card assembly from inner to outer elements
  cardImageDiv.append(cardImage);
  cardActionDiv.append(cardAddButton);
  cardActionDiv.append(cardDeleteButton);
  cardDiv.append(cardImageDiv);
  cardDiv.append(cardTitleSpan);
  cardDiv.append(cardContentDiv);
  cardDiv.append(cardActionDiv);
  colDiv.append(cardDiv);
  rowDiv.append(colDiv);

  // sort candy by candy type
  switch (type) {
    case candyType.cracker:
      const rowTabCracker = document?.getElementById("rowTab_cracker");
      rowTabCracker.append(colDiv);
      break;

    case candyType.drinks:
      const rowTabDrinks = document?.getElementById("rowTab_drinks");
      rowTabDrinks.append(colDiv);
      break;

    case candyType.other:
      const rowTabOther = document?.getElementById("rowTab_other");
      rowTabOther.append(colDiv);
      break;

    case candyType.favorite:
      const rowTabFavorite = document?.getElementById("rowTab_favorite");
      rowTabFavorite.append(colDiv);
      break;

    default:
      console.log("ERROR no candy type loaded");
      break;
  }
}
