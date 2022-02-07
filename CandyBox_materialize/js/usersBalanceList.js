const rowTabUserBalance = document.getElementById("rowTab_user_balance");

function createListOfUsersBalances(userName, userBalance) {
  let arrayRender = [userName, userBalance];

  for (let i = 0; i < 2; i++) {
    // create a new div element
    const listItem = document.createElement("h5");
    const colDivName = document.createElement("div");

    // add tags to elements
    colDivName.className = "col s6";
    listItem.className = "center";

    // and give it some content
    const listItemText = document.createTextNode(arrayRender[i]);

    // card assembly from inner to outer elements
    listItem.append(listItemText);
    colDivName.append(listItem);
    rowTabUserBalance.append(colDivName);
  }
}
