/* eslint-disable no-undef */
const credentials = require("./../client_secret.json");
const { docSetup } = require("../db/docSetup");
const { PaymentRequestHandler } = require("../handlers/paymentRequestHandler");
const { CandyErrors } = require("../constants/candyErrors");
const { Candy } = require("../db/candy");
const { DbFormulas } = require("../db/dbFormulas");
const { CandyConstants } = require("../constants/candyConstants");
const { TestMock } = require("./testMock");

var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe("PaymentRequestHandler", function () {
  this.timeout(TestMock.timeOut);

  let handler;
  let doc;
  let sheet;

  let price_1 = 10;
  let price_2 = 20;

  let candy_1 = new Candy(1, "twix", price_1, CandyConstants.candyType.cracker);
  let candy_2 = new Candy(
    2,
    "snickers",
    price_2,
    CandyConstants.candyType.cracker
  );
  let candies = [candy_1, candy_2];

  beforeEach(async () => {
    handler = new PaymentRequestHandler();
    doc = docSetup.doc;
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    sheet = doc.sheetsByTitle[TestMock.testUser];
    await sheet.loadCells();
  });

  describe("enrich", function () {
    it("enrich_whenError_ShouldReturnError", function () {
      expect(handler.enrich()).to.equal(CandyErrors.docNotExist);
    });

    it("enrich_ShouldReturnBalance", function () {
      let result = handler.enrich(
        TestMock.candiesPriceToPay,
        TestMock.actualUserBalance,
        doc,
        TestMock.testUser
      );
      expect(result).to.equal(
        TestMock.candiesPriceToPay + TestMock.actualUserBalance
      );
    });
  });

  describe("consume", function () {
    it("consume_WhenSheetUndefined_ShouldReturnError", async () => {
      expect(await handler.consume(doc, candies, "no_exist_User")).to.equal(
        CandyErrors.sheetNotExist("no_exist_User")
      );
    });

    it("consume_ShouldWriteToDatabase", async () => {
      this.timeout(TestMock.timeOut);

      const balanceBefore = await sheet.getCellByA1(
        DbFormulas.balanceCellPosition
      );

      let doc_2 = docSetup.doc;
      await doc_2.useServiceAccountAuth(credentials);
      await doc_2.loadInfo();

      try {
        await handler.consume(doc, candies, TestMock.testUser);
      } catch (e) {
        console.log(e);
      }

      let sheet_2 = doc_2.sheetsByTitle[TestMock.testUser];
      await sheet_2.loadCells();

      const balanceAfter = await sheet_2.getCellByA1(
        DbFormulas.balanceCellPosition
      );

      let result = balanceAfter.value - balanceBefore.value;

      expect(result).to.equal(-30);
    });
  });
});
