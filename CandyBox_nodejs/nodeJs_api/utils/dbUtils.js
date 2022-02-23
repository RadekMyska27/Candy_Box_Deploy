/* eslint-disable no-undef */
const { CandyErrors } = require("../constants/candyErrors");
const { Validations } = require("../validations/validations");
const credentials = require("./../client_secret.json");
const { CandyWithHistory } = require("../db/candy");
const { DbFormulas } = require("../db/dbFormulas");
const { LogUtils } = require("../utils/logUtils");
const { CandyMessages } = require("../constants/candyMessages");
const { Utils } = require("../utils/utils");
const { CandyConstants } = require("../constants/candyConstants");

const validations = new Validations();
const utils = new Utils();

const candyDatesColumnIndex = 1;
const candyIdsColumnIndex = 2;
const candyNamesColumnIndex = 3;
const candyTypesColumnIndex = 4;
const candyPricesColumnIndex = 5;
const candyActualAmountColumnIndex = 6;
const candyMinAmountColumnIndex = 7;
const candyMaxAmountColumnIndex = 8;
const candyConsumedColumnIndex = 9;

class DbUtils {
  get headerRow() {
    return 1;
  }

  get className() {
    return this.constructor.name;
  }

  async setBalanceCellFormula(sheet) {
    const balanceCell = await sheet.getCellByA1(DbFormulas.balanceCellPosition);
    balanceCell.formula = DbFormulas.sumOfAmount;
    return balanceCell.formula;
  }

  async getNewRowId(sheet) {
    let rows = [];
    rows = await sheet.getRows();
    return rows.length + this.headerRow;
  }

  setDbFormulas(doc, usersNames) {
    let error = validations.processErrors(validations.docExist(doc));

    if (error !== undefined) {
      return error;
    }

    usersNames.forEach(async (userName) => {
      try {
        const sheet = await this.getSheetByUserName(doc, userName);
        error = validations.sheetExist(sheet, userName);
        if (error !== undefined) {
          return error;
        }
        await sheet.loadCells();
        await this.setBalanceCellFormula(sheet);
        await sheet.saveUpdatedCells();
      } catch (e) {
        LogUtils.log(this.className, CandyErrors.googleSheetError + e);
        return CandyErrors.googleSheetError + e;
      }
    });
  }

  async getSheetByUserName(doc, userName) {
    try {
      await doc.useServiceAccountAuth(credentials);
      await doc.loadInfo();
      return doc.sheetsByTitle[userName];
    } catch (e) {
      LogUtils.log(this.className, CandyErrors.googleSheetError + e);
      return CandyErrors.googleSheetError + e;
    }
  }

  //TODO Test
  async getPurchasedItemsIds(sheet) {
    let id;
    let ids = [];

    await sheet.loadCells();

    for (let i = 1; i < 1000; i++) {
      id = await sheet.getCell(i, candyIdsColumnIndex);
      if (id.value != null) {
        //TODO try use push() insted of [index]
        let index = ids.length;
        ids[index] = id.value;
      }
    }
    return ids;
  }

  //TODO tests
  async increaseItemAmountAtStore(sheet, itemToUpdateId, candyName) {
    await this.updateItemAtStore(
      sheet,
      itemToUpdateId,
      1,
      null,
      null,
      null,
      candyName,
      false
    );
  }

  //TODO tests
  async decreaseItemAmountAtStore(sheet, itemToUpdateId, candyName) {
    await this.updateItemAtStore(
      sheet,
      itemToUpdateId,
      -1,
      null,
      null,
      null,
      candyName,
      true
    );
  }

  //TODO tests
  // TODO candy info as one parametr -> object
  async updateItemAtStore(
    sheet,
    itemToUpdateId,
    amountToAdd,
    minAmountValue,
    maxAmountValue,
    candyPrice,
    candyName,
    isCandyConsumed
  ) {
    let updatedCandy;
    try {
      await sheet.loadCells();

      for (let i = 1; i < 500; i++) {
        let candyUpdateDateValue = await sheet.getCell(
          i,
          candyDatesColumnIndex
        );
        let candyItemId = await sheet.getCell(i, candyIdsColumnIndex);
        let candyActualAmountValue = await sheet.getCell(
          i,
          candyActualAmountColumnIndex
        );
        let candyConsumedValue = await sheet.getCell(
          i,
          candyConsumedColumnIndex
        );
        let candyMinAmountValue = await sheet.getCell(
          i,
          candyMinAmountColumnIndex
        );
        let candyMaxAmountValue = await sheet.getCell(
          i,
          candyMaxAmountColumnIndex
        );

        let candyPriceValue = await sheet.getCell(i, candyPricesColumnIndex);
        let candyNameValue = await sheet.getCell(i, candyNamesColumnIndex);
        let candyTypeValue = await sheet.getCell(i, candyTypesColumnIndex);

        const itemId = parseInt(candyItemId.value, 10);

        if (itemToUpdateId === itemId) {
          this.tryUpdateActualAmount(
            candyActualAmountValue,
            candyConsumedValue,
            amountToAdd,
            isCandyConsumed
          );
          this.tryUpdateCandyProperty(minAmountValue, candyMinAmountValue);
          this.tryUpdateCandyProperty(maxAmountValue, candyMaxAmountValue);
          this.tryUpdateCandyProperty(candyPrice, candyPriceValue);
          this.tryUpdateCandyName(candyName, candyNameValue);

          candyUpdateDateValue.value = utils.getActualDate();

          await sheet.saveUpdatedCells();

          updatedCandy = new CandyWithHistory(
            candyItemId.value,
            candyNameValue.value,
            candyPriceValue.value,
            candyTypeValue.value,
            candyUpdateDateValue.value,
            candyActualAmountValue.value,
            candyMinAmountValue.value,
            candyMaxAmountValue.value,
            candyConsumedValue.value
          );

          LogUtils.log(
            this.className,
            CandyMessages.candyStoreUpdated(candyName)
          );
        }
      }
    } catch (error) {
      LogUtils.log(this.className, error);
    }

    return updatedCandy;
  }

  tryUpdateCandyProperty(candyPropertyToUpdate, candyPropertyActualValue) {
    if (typeof candyPropertyToUpdate === "string") {
      candyPropertyToUpdate = this.tryConvertStringValueToNum(
        candyPropertyToUpdate
      );
    }

    if (candyPropertyToUpdate !== null) {
      candyPropertyActualValue.value = candyPropertyToUpdate;
    }
  }

  tryUpdateActualAmount(
    candyActualAmount,
    candyConsumed,
    amountToAdd,
    isCandyConsumed
  ) {
    if (typeof amountToAdd === "string") {
      amountToAdd = this.tryConvertStringValueToNum(amountToAdd);
    }

    if (amountToAdd !== null) {
      candyActualAmount.value = candyActualAmount.value + amountToAdd;
      if (isCandyConsumed) {
        candyConsumed.value = candyConsumed.value - amountToAdd;
      }
    }
  }

  tryUpdateCandyName(candyPropertyToUpdate, candyPropertyActualValue) {
    if (candyPropertyToUpdate !== null && candyPropertyToUpdate !== "") {
      candyPropertyActualValue.value = candyPropertyToUpdate;
    }
  }

  tryConvertStringValueToNum(inputValue) {
    if (inputValue !== "") {
      return parseInt(inputValue, 10);
    } else {
      return null;
    }
  }

  //TODO Unit tests
  async getListOfItemsOutOfStore(doc) {
    const itemsAtStore = await this.getItemsAccordingUserName(
      doc,
      CandyConstants.candyStoreName
    );

    let itemsOutOfStock = [];

    itemsAtStore.forEach((item) => {
      if (this.isHalfOfTheRequiredAmount(item.actualAmount, item.maxAmount)) {
        itemsOutOfStock.push(item);
      }
    });

    return itemsOutOfStock;
  }

  isHalfOfTheRequiredAmount(actualAmount, maxAmount) {
    return actualAmount <= maxAmount / 2;
  }

  //TODO Unit tests
  async getItemsAccordingUserName(doc, userName) {
    let purchasedItems = [];

    try {
      let sheet = await this.getSheetByUserName(doc, userName);

      let error = validations.sheetExist(sheet, userName);
      if (error !== undefined) {
        return error;
      }

      await sheet.loadCells();
      let emptyRows = 0;

      for (let i = 1; i < 1000; i++) {
        let candyItemId = await sheet.getCell(i, candyIdsColumnIndex);
        let candyPurchasedDate = await sheet.getCell(i, candyDatesColumnIndex);
        let candyType = await sheet.getCell(i, candyTypesColumnIndex);
        let candyName = await sheet.getCell(i, candyNamesColumnIndex);
        let candyPrice = await sheet.getCell(i, candyPricesColumnIndex);
        let candyActualAmount = await sheet.getCell(
          i,
          candyActualAmountColumnIndex
        );
        let candyMinAmount = await sheet.getCell(i, candyMinAmountColumnIndex);
        let candyConsumed = await sheet.getCell(i, candyConsumedColumnIndex);
        let candyMaxAmount = await sheet.getCell(i, candyMaxAmountColumnIndex);

        const itemId = candyItemId.value;
        const purchasedDate = candyPurchasedDate.value;
        const name = candyName.value;
        const price = candyPrice.value;
        const type = candyType.value;
        const actualAmount = candyActualAmount.value;
        const minAmount = candyMinAmount.value;
        const maxAmount = candyMaxAmount.value;
        const consumed = candyConsumed.value;

        if (
          purchasedDate === null &&
          name === null &&
          price === null &&
          type === null
        ) {
          emptyRows++;
          if (emptyRows > 2) {
            //TODo const
            break;
          }
        }
        if (
          itemId !== null &&
          purchasedDate !== null &&
          name !== null &&
          price !== null &&
          type !== null
        ) {
          purchasedItems.push(
            new CandyWithHistory(
              itemId,
              name,
              price,
              type,
              purchasedDate,
              actualAmount,
              minAmount,
              maxAmount,
              consumed
            )
          );
        }
      }
    } catch (error) {
      LogUtils.log(this.className, error);
    }

    return new Promise((resolve) => {
      resolve(purchasedItems);
    });
  }
}

module.exports = {
  DbUtils: DbUtils,
};
