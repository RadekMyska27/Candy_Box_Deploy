/* eslint-disable no-undef */

class CandyErrors {
  static googleSheetError = "google sheet error : ";

  static requestValidationError =
    "validation error request can not be proceeded due to validations error(s)";

  static docNotExist = "doc is undefined, request will be not processed";

  static userNameNotRecognized =
    "received user name is not recognized as valid candy user, request will be not processed, request user name: ";
  static userNameNotFindAtDb =
    "received user name is not find at DB, request user name: ";
  static notValidPassword = "password is not valid for user: ";

  static serverIsNotAvailable =
    "Error: server is not available right now, please try it later";

  static enteredPasswordNotValid =
    "entered password is not valid, password lenght is min 2 chars max 100 chars.";

  static userPasswordNotUpdated =
    "user password not be updated because server error, please try it latter.";

  static userNotLogIn(userName, password) {
    return (
      "user is NOT log-in candy box. UserName: " +
      userName +
      " " +
      " Password " +
      password
    );
  }

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
