/* eslint-disable no-undef */
const {CandyErrors} = require("../constants/candyErrors");
const {Validations} = require("../validations/validations");
const credentials = require("./../client_secret.json");
const {CandyWithHistory} = require("../db/candy");
const {DbFormulas} = require("../db/dbFormulas");
const {Users} = require("../db/users");
const {LogUtils} = require("../utils/logUtils");

const users = new Users();
const validations = new Validations();
const candyDatesColumnIndex = 1;
const candyIdsColumnIndex = 2;
const candyNamesColumnIndex = 3;
const candyTypesColumnIndex = 4;
const candyPricesColumnIndex = 5;

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

  setDbFormulas(doc) {
    let error = validations.processErrors(validations.docExist(doc));

    if (error !== undefined) {
      return error;
    }

    users.users.forEach(async (user) => {
      let userName = user.name;

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
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    return doc.sheetsByTitle[userName];
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

  //TODO Unit tests
  async getUserPurchasedItems(doc, userName) {
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
        let candyPurchasedDate = await sheet.getCell(i, candyDatesColumnIndex);
        let candyType = await sheet.getCell(i, candyTypesColumnIndex);
        let candyName = await sheet.getCell(i, candyNamesColumnIndex);
        let candyPrice = await sheet.getCell(i, candyPricesColumnIndex);

        const purchasedDate = candyPurchasedDate.value;
        const name = candyName.value;
        const price = candyPrice.value;
        const type = candyType.value;

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
          purchasedDate !== null &&
          name !== null &&
          price !== null &&
          type !== null
        ) {
          purchasedItems.push(
            new CandyWithHistory(null, name, price, type, purchasedDate)
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
