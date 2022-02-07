/* eslint-disable no-undef */
// var assert = require("assert");
var chai = require("chai");
var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
var should = chai.should(); // Using Should style

const credentials = require("./../client_secret.json");
const { DbUtils } = require("../utils/dbUtils");
const { TestMock } = require("./testMock");
const { docSetup } = require("../db/docSetup");
const { CandyErrors } = require("../constants/candyErrors");
const { CandyConstants } = require("../constants/candyConstants");

describe("DbUtils", function () {
  this.timeout(TestMock.timeOut);

  let utils;
  let doc;
  let sheet;
  let candyStoreSheet;

  beforeEach(async () => {
    utils = new DbUtils();

    doc = docSetup.doc;
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    sheet = doc.sheetsByTitle[TestMock.testUser];
    candyStoreSheet = doc.sheetsByTitle[CandyConstants.candyStoreName];
    await sheet.loadCells();
  });

  describe("headerRow", function () {
    it("headerRow should return 1", function () {
      expect(utils.headerRow).to.equal(1);
    });
  });

  describe("setBalanceCellFormula", function () {
    it("setBalanceCellFormula_shouldSetBalanceFormula", async function () {
      let balanceCellFormula = await utils.setBalanceCellFormula(sheet);
      let expectedBalanceCellFormula = "=SUM(E:E)";

      expect(balanceCellFormula).to.equal(expectedBalanceCellFormula);
    });
  });

  describe("getNewRowId", function () {
    it("getNewRowId_shouldReturnIndexOfNewRow", async function () {
      let rows = [];
      rows = await sheet.getRows();
      let expectedIndex = rows.length + 1;

      let result = await utils.getNewRowId(sheet);
      expect(result).to.equal(expectedIndex);
    });
  });

  describe("setDbFormulas", function () {
    it("setDbFormulas_docUndefined_returnError", function () {
      let result = utils.setDbFormulas(undefined);
      expect(result).to.equal(CandyErrors.docNotExist);
    });

    it("setDbFormulas_setFormulasForSheetsAreSet", function () {
      let result = utils.setDbFormulas(doc);
      expect(result).to.equal(undefined);
    });
  });

  describe("getSheetByUserName", async function () {
    it("getSheetByUserName_shouldReturnSheet", async function () {
      let result = await utils.getSheetByUserName(doc, TestMock.testUser);

      expect(result).to.deep.equal(sheet);
    });
  });

  describe("getUserItemsIds", async function () {
    it("getUserItemsIds_shouldReturnId", async function () {
      let result = await utils.getPurchasedItemsIds(sheet);
      expect(result).not.null;
    });
  });
  describe("getItemsAccordingUserName", async function () {
    it("getItemsAccordingUserName", async function () {
      let result = await utils.getItemsAccordingUserName(
        doc,
        TestMock.testUser
      );
      console.log(result);
    });
  });

  describe("updateItemAmountAtStore", async function () {
    it("updateItemAmountAtStore update actual amount", async function () {
      let result = await utils.updateItemAtStore(
        candyStoreSheet,
        0,
        -1,
        null,
        TestMock.candy_1.name
      );
      console.log(result);
    });

    it("updateItemAmountAtStore update without consumed", async function () {
      let result = await utils.updateItemAtStore(
        candyStoreSheet,
        0,
        100,
        5,
        100,
        89,
        TestMock.candy_1.name,
        false
      );
      console.log(result);
    });

    it("updateItemAmountAtStore update and consumed", async function () {
      let result = await utils.updateItemAtStore(
        candyStoreSheet,
        0,
        -20,
        null,
        null,
        null,
        TestMock.candy_1.name,
        true
      );
      console.log(result);
    });
  });

  describe("decreaseItemAmountAtStore", async function () {
    it("decreaseItemAmountAtStore", async function () {
      let result = await utils.decreaseItemAmountAtStore(
        candyStoreSheet,
        0,
        TestMock.candy_1.name
      );
      console.log(result);
    });
  });

  describe("increaseItemAmountAtStore", async function () {
    it("increaseItemAmountAtStore", async function () {
      let result = await utils.increaseItemAmountAtStore(
        candyStoreSheet,
        0,
        TestMock.candy_1.name
      );
      console.log(result);
    });
  });

  describe("getListOfItemsOutOfStore", async function () {
    it("getListOfItemsOutOfStore", async function () {
      let result = await utils.getListOfItemsOutOfStore(doc);
      console.log(result);
    });
  });
});
