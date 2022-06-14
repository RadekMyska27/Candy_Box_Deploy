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
    const cardAddButton = document.createElement("a");
    const cardDeleteButton = document.createElement("a");
    const buttonsContainer = document.createElement("div");
    const buttonsRowDiv = document.createElement("div");
    const firstButtonColDiv = document.createElement("div");
    const secondButtonsColDiv = document.createElement("div");

    const cardFavoriteCheckBoxInput = document.createElement("input");
    const cardFavoriteCheckBoxSpan = document.createElement("span");
    const cardFavoriteCheckBoxLabel = document.createElement("label");
    const cardFavoriteCheckBox = document.createElement("p");
    const favoriteContainerDiv = document.createElement("div");

    // add tags to elements
    containerDiv.className = "container";
    rowDiv.className = "row";
    if (isMobile()) {
        colDiv.className = "col s12";
    } else {
        colDiv.className = "col s4";
    }
    colDiv.id = "candyCol_" + id.toString();
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

    buttonsContainer.className = "container center";
    buttonsRowDiv.className = "row";
    firstButtonColDiv.className = "col s6";
    secondButtonsColDiv.className = "col s6";

    cardFavoriteCheckBoxInput.type = "checkbox";
    cardFavoriteCheckBoxInput.className = "filled-in";
    cardFavoriteCheckBoxInput.id = "favorite_check_box_input_" + id.toString();

    cardFavoriteCheckBoxSpan.innerText = "Oblibene";
    cardFavoriteCheckBoxSpan.style.fontWeight = "bold";
    cardFavoriteCheckBoxSpan.style.color = "black";

    favoriteContainerDiv.className = "container center";

    // and give it some content

    const ContentName = document.createTextNode(name.replace("_", " ") + " ");
    const ContentPrice = document.createTextNode(price.toString() + ",-");
    const ContentText = document.createTextNode("V KOŠIKU: 0 ks");

    // add the text node to the newly created div
    cardTitleSpan.appendChild(ContentName);
    cardTitleSpan.appendChild(ContentPrice);
    cardContentDiv.appendChild(ContentText);

    // card assembly from inner to outer elements
    cardFavoriteCheckBoxLabel.append(cardFavoriteCheckBoxInput);
    cardFavoriteCheckBoxLabel.append(cardFavoriteCheckBoxSpan);
    cardFavoriteCheckBox.append(cardFavoriteCheckBoxLabel);
    firstButtonColDiv.append(cardAddButton);
    secondButtonsColDiv.append(cardDeleteButton);
    favoriteContainerDiv.append(cardFavoriteCheckBox);
    cardImageDiv.append(cardImage);
    buttonsRowDiv.append(firstButtonColDiv);
    buttonsRowDiv.append(secondButtonsColDiv);
    buttonsContainer.append(buttonsRowDiv);
    cardActionDiv.append(buttonsContainer);
    cardActionDiv.append(favoriteContainerDiv);
    cardDiv.append(cardImageDiv);
    cardDiv.append(cardTitleSpan);
    cardDiv.append(cardContentDiv);
    cardDiv.append(cardActionDiv);
    colDiv.append(cardDiv);
    rowDiv.append(colDiv);

    // sort candy by candy type
    sortCandyAccordingType(type, colDiv);
}

function sortCandyAccordingType(type, colDiv) {
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

        default:
            console.log("ERROR no candy type loaded");
            break;
    }
}




