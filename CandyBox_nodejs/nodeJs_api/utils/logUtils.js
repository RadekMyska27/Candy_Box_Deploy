/* eslint-disable no-undef */

const { Utils } = require("./utils");
const utils = new Utils();

class LogUtils {
  static log(className, message) {
    console.log(
      utils.getActualDate() + " location: " + className + " message: " + message
    );
  }
}

module.exports = {
  LogUtils: LogUtils,
};
