/* eslint-disable no-undef */
class CandyMessages {
  static userBalance(userName, value) {
    return "Account balance of user " + userName + " is: " + value + " CZK";
  }

  static accountUpdateByPay(candyName, userName) {
    return (
      "client account successful update with item " +
      candyName +
      " for user " +
      userName
    );
  }

  static accountUpdateByDeposit(deposit, userName) {
    return (
      "client account successful update with deposit " +
      deposit +
      " for user " +
      userName
    );
  }

  static nodeJsServerListen(port) {
    return "Listening at port number: " + port;
  }

  static candyBoxStarted = "CANDY BOX STARTED :).";
  static candyBoxNotStarted = "CANDY BOX NOT STARTED :(.";
  static userHistoryInit = "users history init";
}

module.exports = {
  CandyMessages: CandyMessages,
};
