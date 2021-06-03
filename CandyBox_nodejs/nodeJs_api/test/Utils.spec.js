/* eslint-disable no-undef */
const { Utils } = require("../utils/utils");

var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe("Utils", function () {
  let utils = new Utils();
  const date = new Date();

  describe("getVariableSymbol", function () {
    it("getVariableSymbol", function () {
      let expectVariableSymbol =
        date.getDate().toString() +
        date.getMonth().toString() +
        date.getFullYear().toString();

      expect(utils.getVariableSymbol()).to.equal(expectVariableSymbol);
    });
  });

  describe("getActualDate", function () {
    it("getActualDate", function () {
      let expectedDate =
        date.getDate().toString() +
        "." +
        (date.getMonth() + 1).toString() +
        "." +
        date.getFullYear().toString() +
        "-" +
        date.getHours().toString() +
        ":" +
        date.getMinutes().toString() +
        ":" +
        date.getSeconds().toString();

      expect(utils.getActualDate()).to.equal(expectedDate);
    });
  });

  describe("getCurrentMonth", function () {
    it("getCurrentMonth", function () {
      let expectedMonth = (date.getMonth() + 1).toString();
      expect(utils.getCurrentMonth()).to.equal(expectedMonth);
    });
  });
});
