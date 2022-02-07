/* eslint-disable no-undef */

const Joi = require("joi");
const { PriceListUtils } = require("../utils/priceListUtils");
const { Users } = require("../db/users");
const { CandyConstants } = require("../constants/candyConstants");

const priceListUtils = new PriceListUtils();

class ValidationSchemes {
  get userNameSchema() {
    return Joi.object({
      userName: Joi.string()
        .min(1)
        .max(CandyConstants.maxMessageChars)
        .valid(...getUsersNames())
        .required(),
    });
  }

  get candySchema() {
    return Joi.object({
      id: Joi.number()
        // .valid(...getCandyIds(doc))  // TODO add validation for candies Ids
        .required(),
      originalId: Joi.number().optional(),
      name: Joi.string()
        .min(2)
        .max(CandyConstants.maxMessageChars)
        // .valid(...getCandyNames(doc)) // TODO add validation for candies name
        .required(),
      type: Joi.string()
        .min(2)
        .max(CandyConstants.maxMessageChars)
        .valid("cracker", "drinks", "other", "favorite")
        .required(),
      price: Joi.number().max(CandyConstants.maxPayValue).required(),
    });
  }

  get depositSchema() {
    return Joi.object({
      userName: Joi.string()
        .valid(...getUsersNames())
        .required(),
      deposit: Joi.number().min(1).max(CandyConstants.maxPayValue).required(),
    });
  }

  get qrCodeSchema() {
    return Joi.object({
      price: Joi.number().min(1).max(CandyConstants.maxPayValue).required(),
      message: Joi.string()
        .min(1)
        .max(CandyConstants.maxMessageChars)
        .required(),
    });
  }

  get clientAccountBalanceQuerySchema() {
    return Joi.object({
      userName: Joi.string()
        .min(1)
        .max(CandyConstants.maxMessageChars)
        .valid(...getUsersNames())
        .required(),
    });
  }
}

function getUsersNames() {
  const users = new Users();
  return users.users.map((i) => i.name);
}

async function getCandyNames(doc) {
  return await priceListUtils.getCandiesAtStore(doc).map((i) => i.name);
}

async function getCandyIds(doc) {
  let candyPriceList = await priceListUtils.getCandiesAtStore(doc);

  return candyPriceList
    .map((i) => i.id)
    .concat(priceListUtils.getFavoriteIds(candyPriceList));
}

module.exports = {
  ValidationSchemes: ValidationSchemes,
};
