/* eslint-disable no-undef */
const { LogUtils } = require("../utils/logUtils");
const { CandyErrors } = require("../constants/candyErrors");
const { CandyMessages } = require("../constants/candyMessages");
const { DbUtils } = require("../db/dbUtils");
const { Validations } = require("../validations/validations");
const { Utils } = require("../utils/utils");

const utils = new Utils();
const validations = new Validations();
const dbUtils = new DbUtils();

class DepositRequestHandler {
  get className() {
    return this.constructor.name;
  }

  enrich(deposit, actualUserBalance, doc, userName) {
    let error = validations.processErrors(
      validations.docExist(doc),
      validations.usernameExist(userName)
    );
    if (error !== undefined) {
      return error;
    }

    return actualUserBalance + deposit;
  }

  async consume(doc, deposit, userName) {
    try {
      const sheet = await dbUtils.getSheetByUserName(doc, userName);
      let error = validations.sheetExist(sheet, userName);
      if (error !== undefined) {
        return error;
      }

      await sheet.loadCells();

      await sheet.addRow({
        id: await dbUtils.getNewRowId(sheet),
        date: utils.getActualDate(),
        item: "deposit",
        itemType: "N/A",
        amount: deposit,
      });
      LogUtils.log(
        this.className,
        CandyMessages.accountUpdateByDeposit(deposit, userName)
      );

      await sheet.saveUpdatedCells();
    } catch (e) {
      LogUtils.log(this.className, CandyErrors.googleSheetError + e);
    }
  }
}

module.exports = {
  DepositRequestHandler: DepositRequestHandler,
};
