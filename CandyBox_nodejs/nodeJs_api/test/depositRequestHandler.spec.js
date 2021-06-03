/* eslint-disable no-undef */

const { DepositRequestHandler } = require("../handlers/depositRequestHandler");
const { CandyErrors } = require("../constants/candyErrors");
const credentials = require("./../client_secret.json");
const { docSetup } = require("../db/docSetup");
const { DbFormulas } = require("../db/dbFormulas");
const { TestMock } = require("./testMock");

var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe("DepositRequestHandler", function () {
  this.timeout(TestMock.timeOut);

  let handler;
  let doc;
  let sheet;

  beforeEach(async () => {
    handler = new DepositRequestHandler();
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
    it("enrich_ShouldReturnDeposit", function () {
      let result = handler.enrich(10, 20, doc, TestMock.testUser);
      expect(result).to.equal(30);
    });
  });

  describe("consume", function () {
    it("consume_WhenSheetUndefined_ShouldReturnError", async () => {
      expect(await handler.consume(doc, 10, "no_exist_User")).to.equal(
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
        await handler.consume(doc_2, 200, TestMock.testUser);
      } catch (e) {
        console.log(e);
      }

      let sheet_2 = doc_2.sheetsByTitle[TestMock.testUser];
      await sheet_2.loadCells();

      const balanceAfter = await sheet_2.getCellByA1(
        DbFormulas.balanceCellPosition
      );

      let result = balanceAfter.value - balanceBefore.value;

      expect(result).to.equal(200);
    });
  });
});
