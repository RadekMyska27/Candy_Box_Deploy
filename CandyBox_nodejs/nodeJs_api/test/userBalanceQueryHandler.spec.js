/* eslint-disable no-undef */
const { docSetup } = require("../db/docSetup");
const { TestMock } = require("./testMock");
const credentials = require("./../client_secret.json");
const {
  UserBalanceQueryHandler,
} = require("../handlers/userBalanceQueryHandler");
const { CandyErrors } = require("../constants/candyErrors");

var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe("UserBalanceQueryHandler", function () {
  this.timeout(TestMock.timeOut);

  let handler;
  let doc;
  let sheet;

  beforeEach(async () => {
    handler = new UserBalanceQueryHandler();
    doc = docSetup.doc;
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    sheet = doc.sheetsByTitle[TestMock.testUser];
    await sheet.loadCells();
  });

  describe("validation", function () {
    it("validation_whenError_shouldReturnError", function () {
      expect(handler.validation()).to.equal(CandyErrors.docNotExist);
    });
  });

  describe("consume", function () {
    it("consume_WhenSheetUndefined_ShouldReturnError", async () => {
      expect(await handler.consume(doc, "no_exist_User")).to.equal(
        CandyErrors.sheetNotExist("no_exist_User")
      );
    });

    it("consume_ShouldReturnBalance", async () => {
      this.timeout(TestMock.timeOut);

      let result = await handler.consume(doc, TestMock.testUser);
      expect(result).to.be.a("number");
      result.should.not.equal(0);
      result.should.not.Throw;
    });
  });
});
