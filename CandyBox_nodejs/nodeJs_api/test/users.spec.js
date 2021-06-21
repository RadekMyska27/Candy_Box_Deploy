/* eslint-disable no-undef */
const { TestMock } = require("./testMock");
const { User } = require("../db/users");
const { Users } = require("../db/users");
const { UsersStatus } = require("../db/users");

var chai = require("chai");
var assert = chai.assert; // Using Assert style
var expect = chai.expect; // Using Expect style
var should = chai.should(); // Using Should style

describe("Users", function () {
  this.timeout(TestMock.timeOut);

  const users = new Users();

  it("users_shouldReturn_allUsers", function () {
    expect(JSON.stringify(users.users)).to.equal(
      JSON.stringify([
        new User(0, "andy", UsersStatus.userStatus.production),
        new User(1, "marek", UsersStatus.userStatus.production),
        new User(2, "martin", UsersStatus.userStatus.production),
        new User(3, "mirek", UsersStatus.userStatus.production),
        new User(4, "radek", UsersStatus.userStatus.production),
        new User(5, "tomas", UsersStatus.userStatus.production),
        new User(8, "test_1", UsersStatus.userStatus.nonProduction),
        new User(9, "test_2", UsersStatus.userStatus.nonProduction),
      ])
    );
  });

  it("productionUsers_shouldReturn_productionUsers", function () {
    expect(JSON.stringify(users.productionUsers)).to.equal(
      JSON.stringify([
        new User(0, "andy", UsersStatus.userStatus.production),
        new User(1, "marek", UsersStatus.userStatus.production),
        new User(2, "martin", UsersStatus.userStatus.production),
        new User(3, "mirek", UsersStatus.userStatus.production),
        new User(4, "radek", UsersStatus.userStatus.production),
        new User(5, "tomas", UsersStatus.userStatus.production),
      ])
    );
  });

  it("User_constructor", function () {
    let user = new User();
    user.id = 1;
    user.name = TestMock.testUser;
    user.status = UsersStatus.userStatus.production;

    expect(JSON.stringify(user)).to.equal(
      JSON.stringify(
        new User(1, TestMock.testUser, UsersStatus.userStatus.production)
      )
    );
  });
});
