/* eslint-disable no-undef */

const { Candy } = require("./candy");
const { CandyConstants } = require("../constants/candyConstants");

// TODO rewrite to use class Candy New US !!
function getCandyPriceList() {
  return [
    {
      id: 0,
      name: "croissant_maly",
      price: 20,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 1,
      name: "margotka",
      price: 20,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 2,
      name: "kitkat_klasik",
      price: 20,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 3,
      name: "kitkat_tycinka",
      price: 20,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 4,
      name: "mysli_tycinka",
      price: 15,
      type: CandyConstants.candyType.cracker,
    },
    { id: 5, name: "corny", price: 25, type: CandyConstants.candyType.cracker },
    {
      id: 6,
      name: "polomacene_opl",
      price: 20,
      type: CandyConstants.candyType.cracker,
    },
    { id: 7, name: "twix", price: 20, type: CandyConstants.candyType.cracker },
    {
      id: 8,
      name: "snickers",
      price: 20,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 9,
      name: "pernik",
      price: 15,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 10,
      name: "tratranky",
      price: 15,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 11,
      name: "kastany",
      price: 20,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 12,
      name: "minonky",
      price: 20,
      type: CandyConstants.candyType.cracker,
    },
    { id: 13, name: "bebe", price: 15, type: CandyConstants.candyType.cracker },
    {
      id: 14,
      name: "croissant_max",
      price: 25,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 15,
      name: "birell",
      price: 30,
      type: CandyConstants.candyType.drinks,
    },
    {
      id: 16,
      name: "birell_ovocny",
      price: 30,
      type: CandyConstants.candyType.drinks,
    },
    {
      id: 17,
      name: "coca_cola",
      price: 25,
      type: CandyConstants.candyType.drinks,
    },
    {
      id: 18,
      name: "shock_330ml",
      price: 30,
      type: CandyConstants.candyType.drinks,
    },
    {
      id: 19,
      name: "red_bull_250ml",
      price: 40,
      type: CandyConstants.candyType.drinks,
    },
    {
      id: 20,
      name: "shock_500ml",
      price: 40,
      type: CandyConstants.candyType.drinks,
    },
    {
      id: 21,
      name: "polivka_sacek",
      price: 20,
      type: CandyConstants.candyType.other,
    },
    {
      id: 22,
      name: "polivka_kelimek",
      price: 40,
      type: CandyConstants.candyType.other,
    },
    {
      id: 23,
      name: "ovesna_kase",
      price: 15,
      type: CandyConstants.candyType.other,
    },
    {
      id: 24,
      name: "ryzova_kase",
      price: 20,
      type: CandyConstants.candyType.other,
    },
    {
      id: 25,
      name: "mandarinky",
      price: 35,
      type: CandyConstants.candyType.other,
    },
    {
      id: 26,
      name: "kukurice",
      price: 40,
      type: CandyConstants.candyType.other,
    },
    { id: 27, name: "olivy", price: 20, type: CandyConstants.candyType.other },
    {
      id: 28,
      name: "bramburky",
      price: 20,
      type: CandyConstants.candyType.other,
    },
    {
      id: 29,
      name: "zele_bonbon",
      price: 4,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 30,
      name: "hame_easy_cup",
      price: 80,
      type: CandyConstants.candyType.other,
    },
    {
      id: 31,
      name: "universal_candy",
      price: 25,
      type: CandyConstants.candyType.cracker,
    },
    {
      id: 32,
      name: "bake_rolls",
      price: 30,
      type: CandyConstants.candyType.other,
    },
    {
      id: 33,
      name: "mattoni",
      price: 20,
      type: CandyConstants.candyType.drinks,
    },
    {
      id: 34,
      name: "magnesia",
      price: 20,
      type: CandyConstants.candyType.drinks,
    },
  ];
}

module.exports = {
  getCandyPriceList,
};
