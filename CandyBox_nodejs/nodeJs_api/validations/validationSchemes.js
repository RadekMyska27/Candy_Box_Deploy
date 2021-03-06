/* eslint-disable no-undef */

const Joi = require("joi");
const {getCandyPriceList} = require("../db/priceList");
const {Users} = require("../db/users");
const {CandyConstants} = require("../constants/candyConstants");

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
                .valid(...getCandyIds())
                .required(),
            name: Joi.string()
                .min(2)
                .max(CandyConstants.maxMessageChars)
                .valid(...getCandyNames())
                .required(),
            type: Joi.string()
                .min(2)
                .max(CandyConstants.maxMessageChars)
                .valid("cracker", "drinks", "other")
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

function getCandyNames() {
    return getCandyPriceList().map((i) => i.name);
}

function getCandyIds() {
    return getCandyPriceList().map((i) => i.id);
}

module.exports = {
    ValidationSchemes: ValidationSchemes,
};
