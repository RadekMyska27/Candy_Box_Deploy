function setUserSelectorListener() {
  for (let i = 0; i < users.length; i++) {
    const selectUserItem = document.getElementById("user_" + i.toString());
    const selectUserMobItem = document.getElementById(
      "user_mob_" + i.toString()
    );

    if (selectUserItem !== null) {
      selectUserListener(selectUserItem);
    } else {
      console.log("selectUserButton is null");
    }

    if (selectUserMobItem !== null) {
      selectUserListener(selectUserMobItem);
    } else {
      console.log("selectUserButton mob is null");
    }
  }
}

function selectUserListener(selectUserItem) {
  selectUserItem.addEventListener("click", function () {
    userAccountButton.style.visibility = "visible";
    userAccountButtonMobile.style.visibility = "visible";
    userName = selectUserItem.value;
    userSelectButton.innerHTML = selectUserItem.value;
    userSelectButtonMobile.innerHTML = selectUserItem.value;
  });
}
