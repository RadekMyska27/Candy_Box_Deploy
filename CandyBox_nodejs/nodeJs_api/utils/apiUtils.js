/* eslint-disable no-undef */

class ApiUtils {
  serverNotAvailableResponse(error) {
    if (error !== undefined) {
      return JSON.stringify(error);
    }
  }

  getCandiePrice(candies) {
    //TODO move to ...
    let price = 0;
    for (const candy of candies) {
      price += candy.price;
    }

    return price;
  }
}

module.exports = {
  ApiUtils: ApiUtils,
};
