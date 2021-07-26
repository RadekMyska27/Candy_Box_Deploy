/* eslint-disable no-undef */
const {ApiUtils} = require("../utils/apiUtils");
const {CandyWithHistory} = require("../db/candy");
const {
  ClientsAccountCacheUtils,
} = require("../utils/clientsAccountCacheUtils");
const {DbUtils} = require("../utils/dbUtils");
const {LogUtils} = require("../utils/logUtils");
const {CandyErrors} = require("../constants/candyErrors");
const {CandyMessages} = require("../constants/candyMessages");
const {Validations} = require("../validations/validations");
const {Utils} = require("../utils/utils");
const apiUtils = new ApiUtils();

const utils = new Utils();
const validations = new Validations();
const dbUtils = new DbUtils();
const clientsAccountCacheUtils = new ClientsAccountCacheUtils();

class PaymentRequestHandler {
  get className() {
    return this.constructor.name;
  }

  enrich(candies, actualUserBalance, doc, userName, userHistoryDictionary) {
    let error = validations.processErrors(
      validations.docExist(doc),
      validations.usernameExist(userName)
    );

    if (error !== undefined) {
      return error;
    }

    let candiesPrice = -Math.abs(apiUtils.getCandiePrice(candies));

    //TODO tests
    candies.forEach((candy) => {
      clientsAccountCacheUtils.updateUserHistory(
        userName,
        new CandyWithHistory(
          null,
          candy.name,
          -Math.abs(candy.price),
          candy.type,
          utils.getActualDate()
        ),
        userHistoryDictionary
      );
    });

    return actualUserBalance + candiesPrice;
  }

  async consume(doc, candies, userName) {
    try {
      const sheet = await dbUtils.getSheetByUserName(doc, userName);

      let error = validations.sheetExist(sheet, userName);
      if (error !== undefined) {
        return error;
      }

      await sheet.loadCells();

      for (const candy of candies) {
        await sheet.addRow({
          id: await dbUtils.getNewRowId(sheet),
          date: utils.getActualDate(),
          itemId: candy.id,
          item: candy.name,
          itemType: candy.type,
          amount: -Math.abs(candy.price),
        });
        LogUtils.log(
          this.className,
          CandyMessages.accountUpdateByPay(candy.name, userName)
        );
      }

      await sheet.saveUpdatedCells();
    } catch (e) {
      LogUtils.log(this.className, CandyErrors.googleSheetError + e);
    }
  }
}

module.exports = {
  PaymentRequestHandler: PaymentRequestHandler,
};
