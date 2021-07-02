/* eslint-disable no-undef */
const { CandyErrors } = require("../constants/candyErrors");
const { Validations } = require("../validations/validations");
const { Users } = require("./users");
const { DbFormulas } = require("./dbFormulas");
const credentials = require("./../client_secret.json");
const { LogUtils } = require("../utils/logUtils");

const users = new Users();
const validations = new Validations();

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

  async getPurchasedItemsIds(sheet) {
    let id;
    let ids = [];

    await sheet.loadCells();

    for (let i = 1; i < 1000; i++) {
      id = await sheet.getCell(i, 2);
      if (id.value != null) {
        let index = ids.length;
        ids[index] = id.value;
      }
    }
    return ids;
  }
}

module.exports = {
  DbUtils: DbUtils,
};
