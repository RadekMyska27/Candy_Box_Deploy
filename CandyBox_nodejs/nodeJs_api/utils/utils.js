/* eslint-disable no-undef */

const date = new Date();

class Utils {
  getVariableSymbol() {
    return (
      date.getDate().toString() +
      date.getMonth().toString() +
      date.getFullYear().toString()
    );
  }

  getActualDate() {
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
