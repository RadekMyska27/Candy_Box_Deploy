/* eslint-disable no-undef */

class Utils {
  getVariableSymbol() {
    let date = new Date();
    return (
      date.getDate().toString() +
      date.getMonth().toString() +
      date.getFullYear().toString()
    );
  }

  getActualDate() {
    let date = new Date();
    return (
      date.getDate().toString() +
      "." +
      this.getCurrentMonth() +
      "." +
      date.getFullYear().toString() +
      "-" +
      date.getHours().toString() +
      ":" +
      date.getMinutes().toString() +
      ":" +
      date.getSeconds().toString()
    );
  }

  getCurrentMonth() {
    let date = new Date();
    let month = date.getMonth() + 1;
    return month.toString();
  }

  async delay(ms) {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = {
  Utils: Utils,
};
