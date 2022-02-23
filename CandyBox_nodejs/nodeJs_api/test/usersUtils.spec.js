/* eslint-disable no-undef */
// var assert = require("assert");
var chai = require("chai");
const { docSetup } = require("../db/docSetup");
const credentials = require("./../client_secret.json");
const { UsersAtDdUtils } = require("../utils/usersAtDdUtils");

var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
var should = chai.should(); // Using Should style

describe("UsersUtils", () => {
  let utils;
  let doc;

  beforeEach(async function () {
    utils = new UsersAtDdUtils();

    doc = docSetup.doc;
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
  });

  it("usersNames", async function () {
    let result = await utils.usersNames(doc);
    console.log(result);
  });

  it("getUsers", async function () {
    let result = await utils.getUsers(doc);
    console.log(result);
  });
});
