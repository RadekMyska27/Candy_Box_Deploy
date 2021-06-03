/* eslint-disable no-undef */

const { LogUtils } = require("../utils/logUtils");
const { Users } = require("../db/users");
const { CandyErrors } = require("../constants/candyErrors");

const users = new Users();

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

  usernameExist(userName) {
    if (users.users.every((user) => userName !== user.name)) {
      return CandyErrors.userNameNotRecognized;
    }
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
