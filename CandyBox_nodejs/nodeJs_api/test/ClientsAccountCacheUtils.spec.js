/* eslint-disable no-undef */

const { docSetup } = require("../db/docSetup");
const {
  ClientsAccountCacheUtils,
} = require("../utils/clientsAccountCacheUtils");
const { TestMock } = require("./testMock");
const credentials = require("./../client_secret.json");
const { CandyErrors } = require("../constants/candyErrors");

var chai = require("chai");
const { CandyWithHistory } = require("../db/candy");
const {
  UserBalanceQueryHandler,
} = require("../handlers/userBalanceQueryHandler");
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe("ClientsAccountCacheUtils", function () {
  this.timeout(TestMock.timeOut);

  let utils;
  let doc;
  beforeEach(async () => {
    utils = new ClientsAccountCacheUtils();
    doc = docSetup.doc;
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
  });

  describe("loadUserBalance", function () {
    it("loadUserBalance_whenError_shouldReturnError", function () {
      utils
        .loadUserBalance()
        .then((response) => {
          expect(response).to.be.null;
        })
        .catch((error) => {
          expect(error).to.equal(CandyErrors.docNotExist);
        });
    });
    it("loadUserBalance_whenError_shouldReturnError", function () {
      utils
        .loadUserBalance(doc, TestMock.testUser)
        .then((response) => {
          expect(response).not.be.null;
        })
        .catch((error) => {
          expect(error).to.be.null;
        });
    });
  });

  describe("updateUsersBalances", () => {
    it("updateUsersBalances_shouldSetBalanceDictionary", async () => {
      let userBalanceQuery = new UserBalanceQueryHandler();
      let balanceDictionary = new Map();
      let userBalance = await userBalanceQuery.consume(doc, TestMock.testUser);

      await utils.updateUsersBalances(doc, balanceDictionary);

      let dictionaryRecord = balanceDictionary.get(TestMock.testUser);

      //TODO tests !!!!
      // expect(dictionaryRecord).to.equal(userBalance);
    });

    it("updateUsersBalances_whenLoadUserBalanceError_shouldNotSetBalanceDictionary", function () {
      //TODO tests !!!!
    });
  });

  describe("softUpdateUserBalance", function () {
    it("softUpdateUserBalance_whenNoRecordForUser_shouldUpdateBalanceDictionary", function () {
      let currencyVolume = 10;
      let balanceDictionary = new Map();

      utils.softUpdateUserBalance(
        TestMock.testUser,
        currencyVolume,
        balanceDictionary
      );
      expect(balanceDictionary.get(TestMock.testUser)).to.equal(10);
    });
    it("softUpdateUserBalance_whenRecordForUser_shouldUpdateBalanceDictionary", function () {
      let currencyVolume = 10;
      let balanceDictionary = new Map();
      balanceDictionary.set(TestMock.testUser, 20);

      utils.softUpdateUserBalance(
        TestMock.testUser,
        currencyVolume,
        balanceDictionary
      );
      expect(balanceDictionary.get(TestMock.testUser)).to.equal(30);
    });
  });

  describe("initUserHistory", () => {
    //TODO tests
    it("initUserHistory", async function () {
      let userHistoryDictionary = new Map();
      // let candyWithHistory = new CandyWithHistory(1, "name", 10, "cracker", "21.7")

      await utils.initUserHistory(doc, userHistoryDictionary);

      console.log(userHistoryDictionary.get(TestMock.testUser));
    });
  });

  describe("updateUserHistory", () => {
    it("updateUserHistory", () => {
      let userHistoryDictionary = new Map();
      let candyWithHistory1 = new CandyWithHistory(1, "name1", 10, "type1", 1);
      let candyWithHistory2 = new CandyWithHistory(2, "name2", 20, "type2", 2);

      userHistoryDictionary.set(TestMock.testUser, [candyWithHistory1]);

      utils.updateUserHistory(
        TestMock.testUser,
        candyWithHistory2,
        userHistoryDictionary
      );

      expect(
        JSON.stringify(userHistoryDictionary.get(TestMock.testUser))
      ).to.equal(JSON.stringify([candyWithHistory1, candyWithHistory2]));
    });
  });
});
