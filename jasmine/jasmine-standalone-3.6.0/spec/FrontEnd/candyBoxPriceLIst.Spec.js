describe("candyBoxPriceList.js Tests", () => {
  afterEach(function () {
    setCandiesToBuy([]);
  });

  describe("intPriceList test", () => {
    it("number of candy in candyList should by according actual number of candies", function () {
      initPriceList();
      const result = getCandyList();
      const lastElement = result.pop();
      const expectedLastElement = {
        id: 30,
        name: "hame_easy_cup",
        price: 80,
        type: candyType.other,
      };
      expect(result.length).toBe(30);
      expect(lastElement).toEqual(expectedLastElement);
    });
  });

  describe("getCandiesToBuy", () => {
    it("should return candiesToBuy", () => {
      setCandiesToBuy([
        {
          id: 1,
          name: "margotka",
          price: 15,
          type: candyType.cracker,
        },
        {
          id: 2,
          name: "margotka",
          price: 15,
          type: candyType.cracker,
        },
      ]);

      let expectedCandies = [
        {
          id: 1,
          name: "margotka",
          price: 15,
          type: candyType.cracker,
        },
        {
          id: 2,
          name: "margotka",
          price: 15,
          type: candyType.cracker,
        },
      ];

      expect(getCandiesToBuy()).toEqual(expectedCandies);
    });
  });

  describe("setCandiesToBuy test", () => {
    it("Should return number of candies at shopping list", function () {
      addCandieToBuy({
        id: 1,
        name: "margotka",
        price: 15,
        type: candyType.cracker,
      });
      addCandieToBuy({
        id: 1,
        name: "margotka",
        price: 15,
        type: candyType.cracker,
      });
      const result = setNumberOfCandies(1);
      expect(result).toBe(2);
    });
  });

  describe("getPriceToPay test", () => {
    it("Should return price of selected candies to pay", function () {
      addCandieToBuy({
        id: 1,
        name: "margotka",
        price: 15,
        type: candyType.cracker,
      });
      addCandieToBuy({
        id: 2,
        price: 20,
        type: candyType.cracker,
      });
      const result = getPriceToPay();
      expect(result).toBe(35);
    });
  });

  describe("getCandiesNamesToPay test", () => {
    it("Should return names of candies at shopping list to pay", function () {
      addCandieToBuy({
        id: 1,
        name: "margotka",
        price: 15,
        type: candyType.cracker,
      });
      addCandieToBuy({
        id: 2,
        name: "snickers",
        price: 20,
        type: candyType.cracker,
      });
      const result = getCandiesNamesToPay();
      expect(result).toEqual("margotka, snickers");
    });
  });

  describe("clearShoppingList test", () => {
    it("Should clear ", function () {
      addCandieToBuy({
        id: 1,
        name: "margotka",
        price: 15,
        type: candyType.cracker,
      });
      addCandieToBuy({
        id: 2,
        name: "snickers",
        price: 20,
        type: candyType.cracker,
      });

      clearShoppingList();

      const candiesToBuy = getCandiesToBuy();
      const margotkaNumber = setNumberOfCandies(1);
      const snickersNumber = setNumberOfCandies(2);

      expect(candiesToBuy).toEqual([]);
      expect(margotkaNumber).toBe(0);
      expect(snickersNumber).toBe(0);
    });
  });
});
