/* eslint-disable no-undef */

const { Utils } = require("./utils");
const utils = new Utils();

fs = require("fs");

class LogUtils {
  static log(className, message) {
    let logMessage = this.getLogMessage(className, message);
    console.log(logMessage);
    this.logToFile(logMessage);
  }

  static logToFile(logMessage) {
    const path = "candyLog.txt";

    fs.open(path, "a", 666, function (e, id) {
      fs.write(id, logMessage + "\n", null, "utf8", function () {
        fs.close(id, function () {});
      });
    });
  }

  static getLogMessage(className, message) {
    return (
      utils.getActualDate() + " location: " + className + " message: " + message
    );
  }

  static getCandiesToLog(candies) {
    let candiesToLog = [];

    candies.forEach((candy) => candiesToLog.push(" " + candy.name));

    return candiesToLog.toString();
  }
}

module.exports = {
  LogUtils: LogUtils,
};
