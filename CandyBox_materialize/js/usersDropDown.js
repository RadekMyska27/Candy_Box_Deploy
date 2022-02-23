//TODO remove it
function addUserToDropDown(id, userName) {
  const userList = document.createElement("li");
  const userListMobile = document.createElement("li");
  const userLabel = document.createElement("a");
  const userLabelMobile = document.createElement("a");
  const label = document.createTextNode(capitalizeFirstLetter(userName));
  const labelMobile = document.createTextNode(capitalizeFirstLetter(userName));

  userLabel.id = "user_" + id.toString();
  userLabel.value = userName;

  userLabelMobile.id = "user_mob_" + id.toString();
  userLabelMobile.value = userName;

  userLabel.appendChild(label);
  userList.appendChild(userLabel);

  userLabelMobile.appendChild(labelMobile);
  userListMobile.appendChild(userLabelMobile);

  const dropdownUsers = document?.getElementById("dropdownUsers");
  const dropdownUsersMobile = document?.getElementById("dropdownUsers_mobile");
  dropdownUsers.append(userList);
  dropdownUsersMobile.append(userListMobile);
}
