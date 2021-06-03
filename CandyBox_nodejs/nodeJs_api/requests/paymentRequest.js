/* eslint-disable no-undef */

const {Candy} = require("../db/candy");

class PaymentRequest {
    userName
    candies = new Candy()
}

module.exports = {
    PaymentRequest: PaymentRequest,
};