/* eslint-disable no-undef */

const { LogUtils } = require("./logUtils");
const { Users } = require("../db/users");
const {
  UserBalanceQueryHandler,
} = require("../handlers/userBalanceQueryHandler");

const userBalanceQuery = new UserBalanceQueryHandler();
const users = new Users();

class ClientsAccountCacheUtils {
  get className() {
    return this.constructor.name;
  }

  loadUserBalance(doc, name) {
    return new Promise((resolve, reject) => {
      let error = userBalanceQuery.validation(doc, name);
      if (error === undefined) {
        resolve(userBalanceQuery.consume(doc, name));
      } else {
        reject(error);
      }
    });
  }

  updateUsersBalances(doc, balanceDictionary) {
    let iterator = 0;
    return new Promise((resolve, reject) => {
      users.users.forEach((i) => {
        let userName = i.name;
        this.loadUserBalance(doc, userName)
          .then((response) => {
            balanceDictionary.set(userName, response);
            iterator++;
            if (iterator === users.users.length) {
              resolve(true);
            }
          })
          .catch((error) => {
            console.log("error");
            LogUtils.log(this.className, error);
            reject(false);
          });
      });
    });
  }

  updateSingleUserBalance(userName, doc, balanceDictionary) {
    this.loadUserBalance(doc, userName)
      .then((response) => {
        balanceDictionary.set(userName, response);
      })
      .catch((error) => {
        console.log("error");
        LogUtils.log(this.className, error);
      });
  }

  softUpdateUserBalance(userName, currencyVolume, balanceDictionary) {
    let actualUserBalance = 0;
    if (balanceDictionary.get(userName) !== undefined) {
      actualUserBalance = balanceDictionary.get(userName);
    }
    let updateBalance = actualUserBalance + currencyVolume;
    balanceDictionary.set(userName, updateBalance);
  }
}

module.exports = {
  ClientsAccountCacheUtils: ClientsAccountCacheUtils,
};
