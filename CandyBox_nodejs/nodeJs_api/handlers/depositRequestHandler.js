/* eslint-disable no-undef */
const { CandyWithHistory } = require("../db/candy");
const {
  ClientsAccountCacheUtils,
} = require("../utils/clientsAccountCacheUtils");
const { DbUtils } = require("../utils/dbUtils");
const { LogUtils } = require("../utils/logUtils");
const { CandyErrors } = require("../constants/candyErrors");
const { CandyMessages } = require("../constants/candyMessages");
const { Validations } = require("../validations/validations");
const {Utils} = require("../utils/utils");
const {CandyConstants} = require("../constants/candyConstants");

const utils = new Utils();
const validations = new Validations();
const dbUtils = new DbUtils();
const clientsAccountCacheUtils = new ClientsAccountCacheUtils();

class DepositRequestHandler {
  get className() {
    return this.constructor.name;
  }

  enrich(
    deposit,
    actualUserBalance,
    doc,
    userName,
    userHistoryDictionary,
    usersNames
  ) {
    let error = validations.processErrors(
      validations.docExist(doc),
      validations.usernameExist(userName, usersNames)
    );
    if (error !== undefined) {
      return error;
    }
    //TODO tests
    clientsAccountCacheUtils.updateUserHistory(
      userName,
      new CandyWithHistory(
          null,
          CandyConstants.candyType.deposit,
          deposit,
          "N/A",
          utils.getActualDate()
      ),
      userHistoryDictionary
    );

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
        item: "deposit", //TODO constant used also in enrich
        itemType: "N/A", // TODO constant
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
