/* eslint-disable no-undef */
const { ApiUtils } = require("../utils/apiUtils");
const { TestMock } = require("./testMock");

var chai = require("chai");
var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
var should = chai.should(); // Using Should style

describe("ApiUtils", function () {
  this.timeout(TestMock.timeOut);

  const utils = new ApiUtils();

  it("serverNotAvailableResponse_noLock_shouldReturnError", function () {
    expect(utils.serverNotAvailableResponse("error")).to.equal(
      JSON.stringify("error")
    );
  });
});
