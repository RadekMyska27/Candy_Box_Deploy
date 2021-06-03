function setAddCandyListener() {
  for (let i = 0; i < candyList.length; i++) {
    const addButton = document.getElementById("add_" + i.toString());
    const candyImage = document.getElementById("candyImage_" + i.toString());

    if (addButton !== null && candyImage !== null) {
      addItemListener(addButton, i);
      addItemListener(candyImage, i);
    }
  }
}

function addItemListener(addElement, i) {
  if (addElement !== null) {
    addElement.addEventListener("click", function () {
      candyList.forEach((candy) => {
        if (candy.id === i) {
          candiesToBuy.push(candy);
          setShoppingListPrice();
          setNumberOfCandies(i);
        }
      });
    });
  } else {
    console.log("no element to add");
  }
}

function setDeleteCandyListener() {
  for (let i = 0; i < candyList.length; i++) {
    const deleteButton = document.getElementById("delete_" + i.toString());

    deleteButton?.addEventListener("click", function () {
      const candyIndex = candiesToBuy.findIndex((candy) => candy.id === i);
      if (candyIndex !== -1) {
        candiesToBuy.splice(candyIndex, 1);
        setShoppingListPrice();
        setNumberOfCandies(i);
      }
    });
  }
}

function setCandyImageEffectOnClick() {
  for (let i = 0; i < candyList.length; i++) {
    const candyImage = document.getElementById("candyImage_" + i.toString());

    candyImage?.addEventListener("click", function () {
      candyImage.style.opacity = "0.3";
      setTimeout(() => {
        candyImage.style.opacity = "1";
      }, 200);
    });
  }
}

function getNameLabel(candyLabel) {
  capitalizeFirstLetter(candyLabel);
  candyLabel.replace("_", " ");
  return candyLabel;
}
