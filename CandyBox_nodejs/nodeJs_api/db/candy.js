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
  constructor(
    id,
    name,
    price,
    type,
    creationDate,
    actualAmount,
    minAmount,
    maxAmount,
    consumed
  ) {
    super(id, name, price, type);
    this.lastUpdateDate = creationDate;
    this.actualAmount = actualAmount;
    this.minAmount = minAmount;
    this.maxAmount = maxAmount;
    this.consumed = consumed;
  }

  lastUpdateDate;
  actualAmount;
  minAmount;
  maxAmount;
  consumed;
}

module.exports = {
  Candy: Candy,
  CandyWithHistory: CandyWithHistory,
};
