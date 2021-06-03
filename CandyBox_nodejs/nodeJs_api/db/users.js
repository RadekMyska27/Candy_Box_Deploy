/* eslint-disable no-undef */

class Users {
  get users() {
    return [
      new User(0, "radek", UsersStatus.userStatus.production),
      new User(1, "andy", UsersStatus.userStatus.production),
      //TODO set tests users as nonProduction after testing
      new User(2, "test_1", UsersStatus.userStatus.production),
      new User(3, "test_2", UsersStatus.userStatus.production),
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
    dummy: "dummy",
    other: "other",
  };
}

module.exports = {
  Users: Users,
  User: User,
  UsersStatus: UsersStatus,
};
