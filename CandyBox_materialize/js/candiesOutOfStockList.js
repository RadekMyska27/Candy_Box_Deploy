const rowItemsOutOfStock = document.getElementById("rowTab_items_outOfStock");

function createListOfItemsOutOfStock(candyName, actualAmount, maxAmount) {
    let itemsToStore =
        typeof maxAmount === "number" ? maxAmount - actualAmount : maxAmount;
    let arrayRender = [candyName, actualAmount, itemsToStore];

    for (let i = 0; i < 3; i++) {
        // create a new div element
        const listItem = document.createElement("h5");
        const listItemMobile = document.createElement("p");
        const colDivName = document.createElement("div");

        // add tags to elements
        colDivName.className = "col s4";
        listItem.className = "center";
        listItemMobile.className = "center";

        // and give it some content
        const listItemText = document.createTextNode(arrayRender[i]);

        // card assembly from inner to outer elements
        if (isMobile()) {

            listItemMobile.append(listItemText);
            colDivName.append(listItemMobile);
        } else {
            listItem.append(listItemText);
            colDivName.append(listItem);
        }
        rowItemsOutOfStock.append(colDivName);
    }
}
