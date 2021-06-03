/* eslint-disable no-undef */

class Candy {
  constructor(id, name, price, type) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.type = type;
  }

  id;
  name;
  price;
  type;
}

module.exports = {
  Candy: Candy,
};
