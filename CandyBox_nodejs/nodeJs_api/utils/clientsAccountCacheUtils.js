/* eslint-disable no-undef */

const { DbUtils } = require("./dbUtils");
const { LogUtils } = require("./logUtils");
const {
  UserBalanceQueryHandler,
} = require("../handlers/userBalanceQueryHandler");
const { UsersAtDdUtils } = require("./usersAtDdUtils");

const userBalanceQuery = new UserBalanceQueryHandler();
const users = new UsersAtDdUtils();
const dbUtils = new DbUtils();

class ClientsAccountCacheUtils {
  get className() {
    return this.constructor.name;
  }

  loadUserBalance(doc, userName) {
    return new Promise((resolve, reject) => {
      let error = undefined; //TODO try repair validations //userBalanceQuery.validation(doc, userName);

      if (error === undefined) {
        resolve(userBalanceQuery.consume(doc, userName));
      } else {
        reject(error);
      }
    });
  }

  async updateUsersBalances(doc, balanceDictionary, userName) {
    return new Promise((resolve, reject) => {
      this.loadUserBalance(doc, userName)
        .then((response) => {
          balanceDictionary.set(userName, response);
          resolve(balanceDictionary);
        })
        .catch((error) => {
          LogUtils.log(this.className, error);
          reject(false);
        });
    });
  }

  getUsersBalances(doc, usersNames) {
    let iterator = 0;
    return new Promise((resolve, reject) => {
      usersNames.forEach((i) => {
        let userName = i.name;
        this.loadUserBalance(doc, userName)
          .then(() => {
            iterator++;
            if (iterator === usersNames.length) {
              resolve(true);
            }
          })
          .catch((error) => {
            LogUtils.log(this.className, error);
            reject(false);
          });
      });
    });
  }

  //TODO tests
  async initUserHistory(doc, userHistoryDictionary, userName) {
    let userHistoryList = [];

    return new Promise((resolve, reject) => {
      dbUtils
        .getItemsAccordingUserName(doc, userName)
        .then((items) => {
          userHistoryList = items;
          userHistoryDictionary.set(userName, userHistoryList);

          resolve(userHistoryDictionary);
        })
        .catch((error) => {
          LogUtils.log(this.className, error);
          reject(false);
        });
    });
  }

  //TODO tests
  updateUserHistory(userName, candyWithHistory, userHistoryDictionary) {
    if (userHistoryDictionary.get(userName) !== undefined) {
      let userHistoryList = userHistoryDictionary.get(userName);
      if (userHistoryList === undefined) {
        userHistoryList = [];
      }
      userHistoryList.push(candyWithHistory);
      userHistoryDictionary.set(userName, userHistoryList);
    }
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
