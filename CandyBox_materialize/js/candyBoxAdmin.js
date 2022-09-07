const candyId = document.getElementById("candy_id");
const candyName = document.getElementById("candy_name");
const candyStoreType = document.getElementById("candy_type");
const candyPrice = document.getElementById("candy_price");
const candyActualAmount = document.getElementById("candy_actualAmount");
const candyMinAmount = document.getElementById("candy_minAmount");
const candyMaxAmount = document.getElementById("candy_maxAmount");
const candyConsumed = document.getElementById("candy_consumed");
const candyUpdate = document.getElementById("candy_update");
const editCandyHeader = document.getElementById("edit_candy_header");
const saveCandyEditButton = document.getElementById("save_candyEdit");
const closeCandyEditButton = document.getElementById("candyEdit_done");
const editCandyAmountInputValue = document.getElementById(
    "edit_candy_amount_value"
);
const editCandyNameInputValue = document.getElementById(
    "edit_candy_name_value"
);
const editCandyPriceInputValue = document.getElementById(
    "edit_candy_price_value"
);
const editCandyMinAmountInputValue = document.getElementById(
    "candy_edit__minAmount_value"
);
const editCandyMaxAmountInputValue = document.getElementById(
    "candy_edit__maxAmount_value"
);

const yearFilterInput = document.getElementById("year_filter");
const monthFilterInput = document.getElementById("month_filter");
const filterConfirmButton = document.getElementById("chart_filter_button");
const balanceLabel = document.getElementById("chart_filter_balance");


let itemsAtStore = [];
let candyToEdit;
let usersAdminPage = [];
let usersBalance = [{userName: "USER NAME", balance: "BALANCE"}];
let lastDayOfMonth
let statisticLabels = []
let statisticDataConsumed = []
let statisticDataPrice = []

const urlIp = "localhost";

initAdminPage().then((r) => console.log("items at store incited"));

async function initAdminPage() {
    loadItemsAtStore();
    // create header for table Items out of stock
    createListOfItemsOutOfStock("NAME", "AMOUNT", "TO STORE");
    loadItemsOutOfStock();
    usersLoad();
    // loadStatistics()
}

function usersLoad() {
    const url = "http://" + urlIp + ":3000/api/users"; //TODO query
    fetch(url, {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
    })
        .then((response) => response.json())
        .then((responseData) => {
            usersAdminPage = responseData;
            usersAdminPage.forEach((user) => {
                usersBalance.push({userName: user.name, balance: "0"});
            });
            usersAdminPage.forEach((user) => {
                if (user.name !== "odhlasit") {
                    //TODO constant
                    userBalanceLoad(user);
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function userBalanceLoad(user) {
    const url = "http://" + urlIp + ":3000/api/clientBalanceQuery"; // http://localhost:3000/api/clientBalanceQuery
    fetch(url, {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify({
            userName: user.name,
        }),
    })
        .then(async (responseBalance) => {
            let userBalance = await responseBalance.json();
            usersBalance.forEach((balance) => {
                if (balance.userName === user.name) {
                    createListOfUsersBalances(
                        capitalizeFirstLetter(balance.userName),
                        userBalance
                    );
                }
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}

function loadItemsAtStore() {
    startLoadOutOfStockLoader();
    const url = "http://" + urlIp + ":3000/api/queryItemsAtStore";
    fetch(url, {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
    })
        .then((response) => response.json())
        .then((responseData) => {
            itemsAtStore = responseData;
            itemsAtStore.forEach((i) =>
                addItemAtStoreToTable(
                    capitalizeFirstLetter(i.name),
                    i.price,
                    i.id,
                    i.actualAmount
                )
            );
            setEditCandyListener(itemsAtStore);
            stopLoadOutOfStockLoader();
        })
        .catch(function (error) {
            console.log(error);
            stopLoadOutOfStockLoader();
        });
}

function loadItemsOutOfStock() {
    const url = "http://" + urlIp + ":3000/api/queryItemsOutOfStock";
    fetch(url, {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
    })
        .then((response) => response.json())
        .then((responseData) => {
            responseData.forEach((i) =>
                createListOfItemsOutOfStock(
                    capitalizeFirstLetter(i.name),
                    i.actualAmount,
                    i.maxAmount
                )
            );
            setEditCandyListener(itemsAtStore);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function loadStatistics() {
    const url = "http://" + urlIp + ":3000/api/querySalesStatistic";
    fetch(url, {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify({
            month: monthFilterInput.value,
            year: yearFilterInput.value
        }),
    })
        .then((response) => response.json())
        .then((responseData) => {
            lastDayOfMonth = responseData.lastDayOfMonth;
            responseData.consumedStatistics.forEach((i) => {
                    statisticLabels.push(i.day)
                    statisticDataConsumed.push(i.consumed)
                    statisticDataPrice.push(i.price)
                }
            )
            setStatisticChart(statisticLabels, statisticDataConsumed, statisticDataPrice)
            setBalanceLabel(responseData.monthBalance)
        })
        .catch(function (error) {
            console.log(error);
        });
}

function saveCandyChanges() {
    const url = "http://" + urlIp + ":3000/api/updateItemsAtStore"; //http://localhost:3000/api/depositRequest
    fetch(url, {
        method: "POST",
        headers: new Headers({
            "content-type": "application/json",
        }),
        body: JSON.stringify({
            id: candyToEdit.id,
            name: editCandyNameInputValue.value,
            price: editCandyPriceInputValue.value,
            amountToAdd: editCandyAmountInputValue.value,
            minAmountValue: editCandyMinAmountInputValue.value,
            maxAmountValue: editCandyMaxAmountInputValue.value,
        }),
    })
        .then(async (editCandyResponse) => {
            let response = await editCandyResponse.json();

            if (response !== null) {
                candyToEdit.name = response.name;
                candyToEdit.price = response.price;
                candyToEdit.actualAmount = response.actualAmount;
                candyToEdit.minAmount = response.minAmount;
                candyToEdit.maxAmount = response.maxAmount;
                candyToEdit.lastUpdateDate = response.lastUpdateDate;

                setupStoreCandyEditModalElements();
                reRenderItemAtStock(itemsAtStore);
                stopSaveEditChangesLoader();
            } else {
                console.log(response);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

saveCandyEditButton?.addEventListener("click", function () {
    startSaveEditChangesLoader();
    saveCandyChanges();
    clearedModalInputsValues();
});

filterConfirmButton?.addEventListener("click", function () {
    loadStatistics();
});

closeCandyEditButton?.addEventListener("click", function () {
    window.location.reload();
});

function setBalanceLabel(monthBalance) {
    balanceLabel.innerHTML = monthBalance + " CZK"
}

function setupStoreCandyEditModalElements() {
    let name = capitalizeFirstLetter(candyToEdit.name);
    editCandyHeader.innerHTML =
        "DETAIL OF THE CANDY: " + name.replace("_", " ") + " ";

    candyId.innerHTML = "Id: " + candyToEdit.id;
    candyName.innerHTML = "Name: " + candyToEdit.name;
    candyStoreType.innerHTML = "Type: " + candyToEdit.type;
    candyPrice.innerHTML = "Price: " + candyToEdit.price;
    candyActualAmount.innerHTML =
        "Actual amount at store: " + candyToEdit.actualAmount;
    candyMinAmount.innerHTML =
        "Minimal amount at store: " + candyToEdit.minAmount;
    candyMaxAmount.innerHTML =
        "Maximal amount at store: " + candyToEdit.maxAmount;
    candyConsumed.innerHTML = "Consumed: " + candyToEdit.consumed;
    candyUpdate.innerHTML = "Last update: " + candyToEdit.lastUpdateDate;
}

function clearedModalInputsValues() {
    editCandyNameInputValue.value = null;
    editCandyPriceInputValue.value = null;
    editCandyAmountInputValue.value = null;
    editCandyMinAmountInputValue.value = null;
    editCandyMaxAmountInputValue.value = null;
}

function startSaveEditChangesLoader() {
    if (document.getElementById("loader_progress") !== null) {
        document.getElementById("loader_progress").style.display = "block";
    }
}

function stopSaveEditChangesLoader() {
    if (document.getElementById("loader_progress") !== null) {
        document.getElementById("loader_progress").style.display = "none";
    }
}

function startLoadOutOfStockLoader() {
    if (document.getElementById("loader_outOfStock") !== null) {
        document.getElementById("loader_outOfStock").style.display = "block";
    }
}

function stopLoadOutOfStockLoader() {
    if (document.getElementById("loader_outOfStock") !== null) {
        document.getElementById("loader_outOfStock").style.display = "none";
    }
}
