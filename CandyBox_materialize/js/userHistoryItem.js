const userHistoryList = document.getElementById("user_history_list");

function createUserHistoryItem(date, name, price) {
  const listItem = document.createElement("h5");

  if (name === "Deposit") {
    name = "Vklad";
  }
  const listItemText = document.createTextNode(
    date + " " + name.replace("_", " ") + " " + price
  );

  listItem.id = "userHistoryItem_" + name;

  listItem.append(listItemText);
  userHistoryList.append(listItem);
}

function deleteUserHistory() {
  userHistoryList.innerHTML = "";
}
