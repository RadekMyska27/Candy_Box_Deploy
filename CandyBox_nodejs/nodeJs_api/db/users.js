/* eslint-disable no-undef */

class Users {
  get users() {
    return [
      new User(0, "andy", UsersStatus.userStatus.production),
      new User(1, "marek", UsersStatus.userStatus.production),
      new User(2, "martin", UsersStatus.userStatus.production),
      new User(3, "mirek", UsersStatus.userStatus.production),
      new User(4, "radek", UsersStatus.userStatus.production),
      new User(5, "tomas", UsersStatus.userStatus.production),
      //TODO set tests users as nonProduction after testing
      new User(8, "test_1", UsersStatus.userStatus.nonProduction),
      new User(9, "test_2", UsersStatus.userStatus.nonProduction),
    ];
  }

  get productionUsers() {
    return this.users.filter(
      (user) => user.status === UsersStatus.userStatus.production
    );
  }
}

class User {
  constructor(id, name, status) {
    this.id = id;
    this.name = name;
    this.status = status;
  }

  id;
  name;
  status;
}

class UsersStatus {
  static userStatus = {
    production: "production",
    nonProduction: "dummy",
    other: "other",
  };
}

module.exports = {
  Users: Users,
  User: User,
  UsersStatus: UsersStatus,
};
