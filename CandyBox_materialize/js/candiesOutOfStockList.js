const rowItemsOutOfStock = document.getElementById("rowTab_items_outOfStock");

function createListOfItemsOutOfStock(candyName, actualAmount, minAmount) {
  let arrayRender = [candyName, actualAmount, minAmount];

  for (let i = 0; i < 3; i++) {
    // create a new div element
    const listItem = document.createElement("h5");
    const colDivName = document.createElement("div");

    // add tags to elements
    colDivName.className = "col s4";
    listItem.className = "center";

    // and give it some content
    const listItemText = document.createTextNode(arrayRender[i]);

    // card assembly from inner to outer elements
    listItem.append(listItemText);
    colDivName.append(listItem);
    rowItemsOutOfStock.append(colDivName);
  }
}
