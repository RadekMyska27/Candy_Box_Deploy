/* eslint-disable no-undef */
const { Utils } = require("../utils/utils");

const utils = new Utils();

class CandyConstants {
  static candyType = { cracker: "cracker", drinks: "drinks", other: "other" };

  static variableSymbol = utils.getVariableSymbol();

  static accountNumber = 2401867771;

  static bankCode = 2010;

  static nodeJsServerName = "CandyBoxApi";

  static nodeJsServerPort = 3000;

  static maxPayValue = 5000;

  static maxMessageChars = 100;

  static productionGoogleSpreadsheet =
    "1CfGPxISyKun9z3qV303FUrPiDD8DkWc6wgkM0L9tbG0";
  static developmentGoogleSpreadsheet =
    "1wkCtjK0iwjlgkr-UaXuVtG1EySjxS0XDad9cuF2HohY";

  static qrCodeLog(amount, message) {
    return (
      "QR CODE send with pay data: accountNumber " +
      this.accountNumber +
      "/" +
      this.bankCode +
      " amount " +
      amount +
      " CZK" +
      " message " +
      message
    );
  }

  static qrCodeUrl(amount, message) {
    return (
      "https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=" +
      this.accountNumber +
      "&bankCode=" +
      this.bankCode +
      "&amount=" +
      amount +
      "&currency=CZK&vs=" +
      this.variableSymbol +
      "&message=QR_PLATBA " +
      message
    );
  }
}

// eslint-disable-next-line no-undef
module.exports = {
  CandyConstants,
};
