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

  static candyStoreUpdated(candyName) {
    return "candy store was update for candy " + candyName;
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

  static userLogIn(userName) {
    return "user is Log-into candy box. UserName: " + userName;
  }

  static userPasswordUpdated(userName) {
    return "user password was updated for user: " + userName;
  }

  static candyBoxStarting = "CANDY BOX is starting please wait .....";
  static candyBoxStarted = "CANDY BOX STARTED :).";
  static candyBoxNotStarted = "CANDY BOX NOT STARTED :(.";
  static userHistoryInit = "users history init for user: ";
  static dailyCallOfUsersBalanceStarted = "Daily Call of users balance STARTED";
  static dailyCallOfUsersBalanceFINISHED =
    "Daily Call of users balance Successfully FINISHED";
  static dailyCallOfUsersBalanceFailed = "Daily Call of users balance FAILED";
  static userBalanceSuccessfullyUpdatedForUser =
    "user Balance successfully updated for user: ";
}

module.exports = {
  CandyMessages: CandyMessages,
};
