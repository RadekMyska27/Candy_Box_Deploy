/* eslint-disable no-undef */
// var assert = require("assert");
var chai = require("chai");
var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
var should = chai.should(); // Using Should style

const credentials = require("./../client_secret.json");
const { Validations } = require("../validations/validations");
const { docSetup } = require("../db/docSetup");
const { CandyErrors } = require("../constants/candyErrors");
const Joi = require("joi");
const { TestMock } = require("./testMock");
const { CandyConstants } = require("../constants/candyConstants");
const { UsersAtDdUtils } = require("../utils/usersAtDdUtils");
const usersUtils = new UsersAtDdUtils();

describe("Validations", function () {
  this.timeout(TestMock.timeOut);

  let validations;
  let doc;
  let sheet;

  beforeEach(async () => {
    validations = new Validations();

    doc = docSetup.doc;
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    sheet = doc.sheetsByTitle[TestMock.testUser];
    await sheet.loadCells();
  });

  describe("requestValidation", function () {
    it("requestValidation_WhenError_ShouldReturnError", function () {
      let schema = Joi.object({
        userName: Joi.string().required(),
        deposit: Joi.number().min(1).max(CandyConstants.maxPayValue).required(),
      });
      let request = {
        userName: "",
        deposit: 0,
      };

      let result = validations.requestValidation(
        "testLocation",
        schema,
        request
      );
      expect(result).not.null;
    });

    it("requestValidation_WhenError_ShouldReturnUndefined", function () {
      let schema = Joi.object({
        userName: Joi.string().required(),
        deposit: Joi.number().min(1).max(CandyConstants.maxPayValue).required(),
      });
      let request = {
        userName: "radek",
        deposit: 100,
      };

      let result = validations.requestValidation("location", schema, request);
      expect(result).to.equal(undefined);
    });
  });

  describe("docExist", function () {
    it("docExist_WhenDocUndefined_ShouldReturnError", function () {
      expect(validations.docExist()).to.equal(CandyErrors.docNotExist);
    });
    it("docExist_WhenDoc_ShouldReturnNull", function () {
      expect(validations.docExist(doc)).to.equal(undefined);
    });
  });

  describe("usernameExist", async function () {
    it("usernameExist_whenUserIsNotSetAtDb_ShouldReturnError", async function () {
      expect(
        validations.usernameExist("nonExist", await usersUtils.usersNames())
      ).to.equal(CandyErrors.userNameNotRecognized);
    });
    it("usernameExist_whenUserIsAtDb_ShouldReturnUndefined", async function () {
      expect(
        validations.usernameExist("radek", await usersUtils.usersNames())
      ).to.equal(undefined);
    });
  });

  describe("sheetExist", function () {
    it("sheetExist_WhenSheetUndefined_ShouldReturnError", function () {
      expect(validations.sheetExist(undefined, "userName")).to.equal(
        CandyErrors.sheetNotExist("userName")
      );
    });
    it("sheetExist_WhenSheet_ShouldReturnNull", function () {
      expect(validations.sheetExist(sheet)).to.equal(undefined);
    });
  });

  describe("processErrors", function () {
    it("processErrors_whenError_ShouldReturnError", function () {
      expect(validations.processErrors(undefined, "e2", "e3", "e4")).to.equal(
        "e2"
      );
    });
    it("processErrors_whenNoError_ShouldReturnUndefined", function () {
      expect(validations.processErrors(undefined)).to.equal(undefined);
    });
  });
});
