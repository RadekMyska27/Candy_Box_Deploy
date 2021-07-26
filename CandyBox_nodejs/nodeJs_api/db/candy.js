/* eslint-disable no-undef */

//TODO unit test
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

//TODO unit test
class CandyWithHistory extends Candy {
  constructor(id, name, price, type, creationDate) {
    super(id, name, price, type);
    this.creationDate = creationDate;
  }

  creationDate;
}

module.exports = {
  Candy: Candy,
  CandyWithHistory: CandyWithHistory,
};
