/* eslint-disable no-undef */
// var assert = require("assert");

var chai = require("chai");
var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
var should = chai.should(); // Using Should style

const {TestMock} = require("./testMock");
const {docSetup} = require("../db/docSetup");
const credentials = require("./../client_secret.json");
const {PriceListUtils} = require("../utils/priceListUtils");

describe("PriceListUtils", function () {
    this.timeout(TestMock.timeOut);

    let utils;
    let doc;
    let sheet;

    beforeEach(async () => {
        utils = new PriceListUtils();

        doc = docSetup.doc;
        await doc.useServiceAccountAuth(credentials);
        await doc.loadInfo();
        sheet = doc.sheetsByTitle[TestMock.testUser];
        await sheet.loadCells();
    });

    describe("getFavoritesItems", function () {
        it("getFavoritesItems", async function () {
            await utils.getFavoritesItems(doc, TestMock.testUser);
            //TODO test
        });
    });
});
