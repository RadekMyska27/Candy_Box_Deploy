/* eslint-disable no-undef */
const { DbUtils } = require("../utils/dbUtils");
const { LogUtils } = require("../utils/logUtils");
const { Validations } = require("../validations/validations");
const { CandyMessages } = require("../constants/candyMessages");
const { DbFormulas } = require("../db/dbFormulas");

const validations = new Validations();
const dbUtils = new DbUtils();

class UserBalanceQueryHandler {
  get className() {
    return this.constructor.name;
  }

  validation(doc, userName) {
    let error = validations.processErrors(
      validations.docExist(doc),
      validations.usernameExist(userName)
    );

    if (error !== undefined) {
      return error;
    }
  }

  async consume(doc, userName) {
    try {
      var sheet = await dbUtils.getSheetByUserName(doc, userName);
      let error = validations.sheetExist(sheet, userName);
      if (error !== undefined) {
        return error;
      }
    } catch (e) {
      LogUtils.log(this.className, e);
    }
    await sheet.loadCells();

    const balanceCell = await sheet.getCellByA1(DbFormulas.balanceCellPosition);

    LogUtils.log(
      this.className,
      CandyMessages.userBalance(userName, balanceCell.value)
    );

    return balanceCell.value;
  }
}

module.exports = {
  UserBalanceQueryHandler: UserBalanceQueryHandler,
};
