function setEditCandyListener(list) {
  list.forEach((item) => {
    const id = item.id;
    const editButton = document.getElementById("edit_" + id.toString());

    if (editButton !== null) {
      addItemListener(editButton, id, list);
    }
  });
}

function addItemListener(editElement, id, list) {
  if (editElement !== null) {
    editElement.addEventListener("click", function () {
      list.forEach((candy) => {
        if (candy.id === id) {
          candyToEdit = {
            id: candy.id,
            name: candy.name,
            price: candy.price,
            type: candy.type,
            lastUpdateDate: candy.lastUpdateDate,
            actualAmount: candy.actualAmount,
            minAmount: candy.minAmount,
            maxAmount: candy.maxAmount,
            consumed: candy.consumed,
          };
        }
      });
      setupStoreCandyEditModalElements();
    });
  } else {
    console.log("no element to edit");
  }
}

function reRenderItemAtStock(list) {
  list.forEach((item) => {
    const id = item.id;
    const amountLabel = document.getElementById("amountLabel_" + id.toString());

    if (amountLabel !== null) {
      if (id === candyToEdit.id) {
        amountLabel.innerHTML =
          "At store: " + candyToEdit.actualAmount + " piece";
      }
    }
  });
}

// Candy{
//     id;
//     name;
//     price;
//     type;
//     creationDate;
//     actualAmount;
//     minAmount;
//     consumed
// }
