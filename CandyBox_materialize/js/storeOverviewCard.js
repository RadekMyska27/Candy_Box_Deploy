function addItemAtStoreToTable(name, price, id, actualAmount) {
    // create a new div element

    const cardActionDiv = document.createElement("div");
    const cardEditButton = document.createElement("a");
    const cardAmountAtStoreLableDiv = document.createElement("div");
    const cardDiv = document.createElement("div");
    const cardTitleSpan = document.createElement("div");
    const colDiv = document.createElement("div");
    const rowDiv = document.createElement("div");

    // add tags to elements
    cardTitleSpan.className = "card-title center";

    if (isMobile()) {
        colDiv.className = "col s12";
    } else {
        colDiv.className = "col s3";
    }

    rowDiv.className = "row";

    cardDiv.className = "card";
    cardDiv.style.alignContent = "center";

    cardActionDiv.className = "card-action";
    cardActionDiv.style.alignContent = "center";

    cardAmountAtStoreLableDiv.id = "amountLabel_" + id.toString();
    cardAmountAtStoreLableDiv.className = "card-content center";
    cardAmountAtStoreLableDiv.style.fontWeight = "bold";

    cardEditButton.id = "edit_" + id.toString();
    cardEditButton.className =
        "modal-trigger waves-effect waves-light btn-small light-green darken-4";
    cardEditButton.innerText = "Detail / Edit";

    if (isMobile()) {
        cardEditButton.style.marginLeft = "30px";
    } else {
        cardEditButton.style.marginLeft = "10px";
    }
    cardEditButton.href = "#modal1";

    // and give it some content

    const ContentName = document.createTextNode(name.replace("_", " ") + " ");
    const ContentText = document.createTextNode(
        "At store: " + actualAmount + " piece"
    );

    // add the text node to the newly created div

    cardTitleSpan.appendChild(ContentName);
    cardAmountAtStoreLableDiv.appendChild(ContentText);

    // card assembly from inner to outer elements

    cardActionDiv.append(cardEditButton);
    cardDiv.append(cardTitleSpan);
    cardDiv.append(cardAmountAtStoreLableDiv);
    cardDiv.append(cardActionDiv);
    colDiv.append(cardDiv);
    rowDiv.append(colDiv);

    // add item to Collapsibles section

    const rowTabStore = document?.getElementById("rowTab_store");
    rowTabStore.append(colDiv);
}
