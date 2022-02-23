function setAddCandyListener(list) {
  list.forEach((item) => {
    let id = item.id;
    const addButton = document.getElementById("add_" + id.toString());
    const candyImage = document.getElementById("candyImage_" + id.toString());

    if (addButton !== null && candyImage !== null) {
      addItemListener(addButton, id, list);
      addItemListener(candyImage, id, list);
    }
  });
}

function addItemListener(addElement, id, list) {
  if (addElement !== null) {
    addElement.addEventListener("click", function () {
      list.forEach((candy) => {
        if (candy.id === id) {
          addCandieToBuy({
            id: candy.id,
            name: candy.name,
            price: candy.price,
            type: candy.type,
          });
          setShoppingListPrice();
          setNumberOfCandies(id);
        }
      });
    });
  } else {
    console.log("no element to add");
  }
}

function setDeleteCandyListener(list) {
  list.forEach((item) => {
    let id = item.id;
    let originalId = undefined;
    let deleteButtonOriginalId = null;

    if (item.originalId !== undefined) {
      originalId = item.originalId;
      deleteButtonOriginalId = document.getElementById(
        "delete_" + originalId.toString()
      );
    }

    const deleteButton = document.getElementById("delete_" + id.toString());

    deleteButton?.addEventListener("click", function () {
      const candyIndex = candiesToBuy.findIndex((candy) => candy.id === id);
      if (candyIndex !== -1) {
        candiesToBuy.splice(candyIndex, 1);
        setShoppingListPrice();
        setNumberOfCandies(id);
      }
    });

    deleteButtonOriginalId?.addEventListener("click", function () {
      const candyIndex = candiesToBuy.findIndex(
        (candy) => candy.id === originalId
      );
      if (candyIndex !== -1) {
        candiesToBuy.splice(candyIndex, 1);
        setShoppingListPrice();
        setNumberOfCandies(id);
      }
    });
  });
}

function setCandyImageEffectOnClick(list) {
  list.forEach((item) => {
    let id = item.id;
    const candyImage = document.getElementById("candyImage_" + id.toString());

    candyImage?.addEventListener("click", function () {
      candyImage.style.opacity = "0.3";
      setTimeout(() => {
        candyImage.style.opacity = "1";
      }, 200);
    });
  });
}

function setFavoriteListener(list) {
  list.forEach((item) => {
    let id = item.id;
    const favoriteButton = document.getElementById(
      "favorite_check_box_input_" + id.toString()
    );
    favoriteItemListener(favoriteButton, id, list);
  });
}

function favoriteItemListener(favoriteButton, id, list) {
  if (favoriteButton !== null) {
    favoriteButton.addEventListener("click", function () {
      list.forEach((candy) => {
        if (candy.id === id) {
          const candyCardMove = document?.getElementById(
            "candyCol_" + id.toString()
          );
          if (favoriteButton.checked) {
            removeFromSectionAddToFavorite(candy, candyCardMove);
          } else {
            addToSectionRemoveFromFavoriteSection(candy, candyCardMove);
          }
          if (userName !== undefined) {
            updateUsersFavoriteItems(candy.id, list);
          }
        }
      });
    });
  } else {
    console.log("no element to add");
  }
}

function disableFavoriteButtons(list) {
  list.forEach((item) => {
    const candyCardFavoriteInput = document?.getElementById(
      "favorite_check_box_input_" + item.id
    );

    candyCardFavoriteInput.setAttribute("disabled", "disabled");
  });
}

function enableFavoriteButtons(list) {
  list.forEach((item) => {
    const candyCardFavoriteInput = document?.getElementById(
      "favorite_check_box_input_" + item.id
    );

    candyCardFavoriteInput.removeAttribute("disabled");
  });
}

function addToSectionRemoveFromFavoriteSection(candy, cardToMove) {
  switch (candy.type) {
    case candyType.cracker:
      const rowTabCracker = document?.getElementById("rowTab_cracker");
      rowTabCracker.append(cardToMove);
      break;

    case candyType.drinks:
      const rowTabDrinks = document?.getElementById("rowTab_drinks");
      rowTabDrinks.append(cardToMove);
      break;

    case candyType.other:
      const rowTabOther = document?.getElementById("rowTab_other");
      rowTabOther.appendChild(cardToMove);
      break;
  }
}

function removeFromSectionAddToFavorite(candy, cardToMove) {
  const rowTabFavorite = document?.getElementById("rowTab_favorite");
  rowTabFavorite.append(cardToMove);
}

function tryMoveCandyToFavoriteItems(candiesAtStore, favoriteCandyId) {
  candiesAtStore.forEach((candy) => {
    let candyId = candy.id.toString();
    if (candyId === favoriteCandyId) {
      const candyCardMove = document?.getElementById("candyCol_" + candyId);
      removeFromSectionAddToFavorite(candy, candyCardMove);
      setFavoriteItemChecked(candyId);
    }
  });
}

function setFavoriteItemChecked(candyId) {
  const candyCardFavoriteInput = document?.getElementById(
    "favorite_check_box_input_" + candyId
  );
  candyCardFavoriteInput.checked = true;
}

function getNameLabel(candyLabel) {
  capitalizeFirstLetter(candyLabel);
  candyLabel.replace("_", " ");
  return candyLabel;
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
