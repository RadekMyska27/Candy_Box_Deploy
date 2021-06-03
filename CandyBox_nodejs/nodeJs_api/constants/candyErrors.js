/* eslint-disable no-undef */

class CandyErrors {
  static googleSheetError = "google sheet error : ";

  static requestValidationError =
    "validation error request can not be proceeded due to validations error(s)";

  static docNotExist = "doc is undefined, request will be not processed";

  static userNameNotRecognized =
    "received user name is not recognized as valid candy user, request will be not processed";

  static serverIsNotAvailable =
    "Error: server is not available right now, please try it later";

  static sheetNotExist(userName) {
    return (
      "sheet is undefined for user " +
      userName +
      ", request will be not processed"
    );
  }

  static depositNotStored(userName, deposit) {
    return (
      "Deposit was not stored for user " +
      userName +
      " with deposit value " +
      deposit +
      " RETRY."
    );
  }

  static paymentNotStored(userName, price) {
    return (
      "Pay was not stored for user " +
      userName +
      " with price " +
      price +
      " RETRY."
    );
  }
}

module.exports = {
  CandyErrors: CandyErrors,
};
