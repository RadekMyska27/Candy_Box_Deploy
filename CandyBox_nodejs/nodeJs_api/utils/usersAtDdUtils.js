/* eslint-disable no-undef */
const { DbUtils } = require("./dbUtils");
const { CandyConstants } = require("../constants/candyConstants");
const { Validations } = require("../validations/validations");
const { User } = require("../db/users");
const { CandyErrors } = require("../constants/candyErrors");
const { LogUtils } = require("./logUtils");

const dbUtils = new DbUtils();
const validations = new Validations();

const userIdColumnIndex = 0;
const userNameColumnIndex = 1;
const userPasswordColumnIndex = 2;
const userFavoriteItemsColumnIndex = 3;

class UsersAtDdUtils {
  get className() {
    return this.constructor.name;
  }

  async usersNames(doc) {
    let usersNames = [];
    const users = await this.getUsers(doc);
    users.forEach((user) => {
      usersNames.push(user.name);
    });

    return usersNames;
  }

  async getUserByName(doc, userName) {
    const usersAtDb = await this.getUsers(doc);
    let user = undefined;

    usersAtDb.forEach((userAtDb) => {
      if (userAtDb.name === userName) {
        user = userAtDb;
      }
    });

    return user;
  }

  async changeUserPassword(doc, userName, password) {
    let user = await this.getUserByName(doc, userName);
    user.passWord = password;

    return await this.updateUserPasswordById(doc, user);
  }

  async getUsers(doc) {
    const sheet = await dbUtils.getSheetByUserName(
      doc,
      CandyConstants.usersSheet
    );
    let error = validations.sheetExist(sheet, CandyConstants.usersSheet);

    if (error !== undefined) {
      LogUtils.log(this.className, CandyErrors.googleSheetError + error);
      return error;
    }

    let usersList = [];

    try {
      await sheet.loadCells();

      for (let i = 1; i < 100; i++) {
        let userId = await sheet.getCell(i, userIdColumnIndex);
        let userName = await sheet.getCell(i, userNameColumnIndex);
        let userPassword = await sheet.getCell(i, userPasswordColumnIndex);
        let userFavoriteItems = await sheet.getCell(
          i,
          userFavoriteItemsColumnIndex
        );

        let favoriteItems = this.splitFavoriteItemsToArray(
          userFavoriteItems.value
        );

        if (
          userId.value != null &&
          userName.value != null &&
          userPassword.value != null
        ) {
          usersList.push(
            new User(
              userId.value,
              userName.value,
              userPassword.value,
              favoriteItems
            )
          );
        }
      }
    } catch (error) {
      LogUtils.log(this.className, error);
    }
    return usersList;
  }

  async updateUserPasswordById(doc, user) {
    const sheet = await dbUtils.getSheetByUserName(
      doc,
      CandyConstants.usersSheet
    );
    let error = validations.sheetExist(sheet, CandyConstants.usersSheet);

    if (error !== undefined) {
      LogUtils.log(this.className, CandyErrors.googleSheetError + error);
      return error;
    }

    try {
      await sheet.loadCells();

      for (let i = 1; i < 100; i++) {
        let userId = await sheet.getCell(i, userIdColumnIndex);
        let userPassword = await sheet.getCell(i, userPasswordColumnIndex);

        if (userId.value === user.id) {
          userPassword.value = user.passWord;
          await sheet.saveUpdatedCells();
        }
      }
    } catch (error) {
      LogUtils.log(this.className, error);
      return error;
    }
  }

  async updateUserFavoriteItem(doc, userId, userName, candyId) {
    const sheet = await dbUtils.getSheetByUserName(
      doc,
      CandyConstants.usersSheet
    );
    let error = validations.sheetExist(sheet, CandyConstants.usersSheet);

    if (error !== undefined) {
      LogUtils.log(this.className, CandyErrors.googleSheetError + error);
      return error;
    }

    try {
      await sheet.loadCells();

      for (let i = 1; i < 100; i++) {
        let userAtDbId = await sheet.getCell(i, userIdColumnIndex);
        let userFavoriteItems = await sheet.getCell(
          i,
          userFavoriteItemsColumnIndex
        );

        if (userAtDbId.value === userId) {
          let favoriteItemsIdsList = this.splitFavoriteItemsToArray(
            userFavoriteItems.value
          );

          let candyIdString = candyId.toString();
          let updatedItems = [];
          if (this.isItemAlreadyFavorite(favoriteItemsIdsList, candyIdString)) {
            updatedItems = this.removeFavoriteItem(
              favoriteItemsIdsList,
              candyIdString
            );
          } else {
            updatedItems = this.addItemToFavorite(
              favoriteItemsIdsList,
              candyIdString
            );
          }

          userFavoriteItems.value = this.convertFavoriteListToString(
            updatedItems
          );

          await sheet.saveUpdatedCells();

          return await this.getUserByName(doc, userName);
        }
      }
    } catch (error) {
      LogUtils.log(this.className, error);
      return error;
    }
  }

  splitFavoriteItemsToArray(favoriteItemsString) {
    return favoriteItemsString !== null
      ? favoriteItemsString.toString().split(";")
      : [];
  }

  isItemAlreadyFavorite(favoriteItemsIdsList, candyId) {
    return favoriteItemsIdsList.some((id) => id === candyId);
  }

  removeFavoriteItem(favoriteItemsIdsList, candyId) {
    return favoriteItemsIdsList.filter((item) => item !== candyId);
  }

  addItemToFavorite(list, candyId) {
    return list.concat(candyId);
  }

  convertFavoriteListToString(list) {
    return list.join(";").toString();
  }
}

module.exports = {
  UsersAtDdUtils: UsersAtDdUtils,
};
