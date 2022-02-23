/* eslint-disable no-undef */

const { LogUtils } = require("../utils/logUtils");
const { CandyErrors } = require("../constants/candyErrors");

class Validations {
  get className() {
    return this.constructor.name;
  }

  requestValidation(location, schema, request) {
    const error = schema.validate(request);
    if (error.error) {
      LogUtils.log(this.className, CandyErrors.requestValidationError);
      LogUtils.log(location, error.error.toString());
      return error.error;
    }
  }

  docExist(doc) {
    if (doc === undefined) {
      return CandyErrors.docNotExist;
    }
  }

  usernameExist(userName, usersNames) {
    if (usersNames.every((user) => userName !== user)) {
      return CandyErrors.userNameNotRecognized;
    }
  }

  isPasswordValid(requestPassword, storedPassWord) {
    return requestPassword.toString() === storedPassWord.toString();
  }

  sheetExist(sheet, userName) {
    if (sheet === undefined) {
      return CandyErrors.sheetNotExist(userName);
    }
  }

  processErrors(...errors) {
    for (let i = 0; i < errors.length; i++) {
      if (errors[i] !== undefined) {
        return errors[i];
      }
    }
  }
}

module.exports = {
  Validations: Validations,
};
