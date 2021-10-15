/* eslint-disable no-undef */

const { Candy } = require("../db/candy");

class TestMock {
  static timeOut = 15000;
  static testUser = "test_1";
  static candy_1 = new Candy(1, "twix", 10, "drink");
  static candy_2 = new Candy(2, "bebe", 20, "cracker");
  static deposit = 10;
  static actualUserBalance = 20;
  static candiesPriceToPay = -10;
}

module.exports = {
  TestMock: TestMock,
};
