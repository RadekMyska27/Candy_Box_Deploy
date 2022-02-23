/* eslint-disable no-undef */

class User {
  constructor(id, name, passWord, favoriteItems) {
    this.id = id;
    this.name = name;
    this.passWord = passWord;
    this.favoriteItems = favoriteItems;
  }

  id;
  name;
  passWord;
  favoriteItems;
}

module.exports = {
  User: User,
};
