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

    // favoriteCandyList.forEach((favorite) => {
    //   if (favorite.originalId === id) {
    //     originalId = favorite.id;
    //     deleteButtonOriginalId = document.getElementById(
    //       "delete_" + originalId.toString()
    //     );
    //   }
    // });

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

function getNameLabel(candyLabel) {
  capitalizeFirstLetter(candyLabel);
  candyLabel.replace("_", " ");
  return candyLabel;
}

function capitalizeFirstLetter(string) {
  return string[0].toUpperCase() + string.slice(1);
}
