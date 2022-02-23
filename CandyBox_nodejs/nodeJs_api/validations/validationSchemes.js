/* eslint-disable no-undef */

const Joi = require("joi");
const { PriceListUtils } = require("../utils/priceListUtils");
const { Users } = require("../db/users");
const { CandyConstants } = require("../constants/candyConstants");
const { CandyErrors } = require("../constants/candyErrors");

const priceListUtils = new PriceListUtils();

class ValidationSchemes {
  get userNameSchema() {
    return Joi.object({
      userName: Joi.string()
        .min(1)
        .max(CandyConstants.maxMessageChars)
        // .valid(...getUsersNames()) // TODO validation for userName
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
        // .valid(...getUsersNames()) //TODO user name validation
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
        // .valid(...getUsersNames()) //TODO validate if users at DB contain userName from request
        .required(),
    });
  }

  get candyToUpdateSchema() {
    return Joi.object({
      id: Joi.number().required(),
      name: Joi.string().max(CandyConstants.maxMessageChars).allow(null, ""),
      price: Joi.string().max(CandyConstants.maxMessageChars).allow(null, ""),
      amountToAdd: Joi.string()
        .max(CandyConstants.maxMessageChars)
        .allow(null, ""),
      minAmountValue: Joi.string()
        .max(CandyConstants.maxMessageChars)
        .allow(null, ""),
      maxAmountValue: Joi.string()
        .max(CandyConstants.maxMessageChars)
        .allow(null, ""),
    });
  }

  get PasswordSchema() {
    return Joi.object({
      userName: Joi.string().required(),
      password: Joi.string()
        .min(2)
        .max(CandyConstants.maxMessageChars)
        .required(),
      // .message(CandyErrors.enteredPasswordNotValid),
    });
  }
}

// function getUsersNames() {
//   const users = new Users();
//   return users.users.map((i) => i.name);
// }

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
