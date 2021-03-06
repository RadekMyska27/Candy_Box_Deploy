/* eslint-disable no-undef */

const {CandyConstants} = require("../constants/candyConstants");
const {getCandyPriceList} = require("../db/priceList");
const {Candy} = require("../db/candy");
const {Validations} = require("../validations/validations");
const {DbUtils} = require("../db/dbUtils");

const dbUtils = new DbUtils();
const validations = new Validations();

class PriceListUtils {
  get className() {
    return this.constructor.name;
  }

  async getFavoritesItems(doc, userName) {
    let itemsByIdsCount = new Map();
    const sheet = await dbUtils.getSheetByUserName(doc, userName);

    let error = validations.sheetExist(sheet, userName);
    if (error !== undefined) {
      return error;
    }

    let purchasedItemsIds = await dbUtils.getPurchasedItemsIds(sheet);

    if (purchasedItemsIds.length === 0) {
      return new Candy();
    }

    for (const purchasedItemsId in purchasedItemsIds) {
      let valueOfId = purchasedItemsIds[purchasedItemsId];

      if (itemsByIdsCount.has(valueOfId)) {
        let value = itemsByIdsCount.get(valueOfId);
        value++;
        itemsByIdsCount.set(valueOfId, value);
      } else {
        itemsByIdsCount.set(valueOfId, 1);
      }
    }

    let itemsByIdsCountSorted = new Map(
        [...itemsByIdsCount.entries()].sort((a, b) => b[1] - a[1])
    );

    let candies = getCandyPriceList();

    let favoriteCandies = [];
    let iterator = 0;

    itemsByIdsCountSorted.forEach((value, key, map) => {
      if (iterator < 5) {
        let favoriteCandy = candies.find((candy) => candy.id === key);
        if (favoriteCandy !== undefined) {
          favoriteCandy.type = CandyConstants.candyType.favorite;
          favoriteCandies.push(favoriteCandy);
        }
      }
      iterator++;
    });

    return favoriteCandies;
  }
}

module.exports = {
  PriceListUtils: PriceListUtils,
};
