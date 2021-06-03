/* eslint-disable no-undef */
const { GoogleSpreadsheet } = require("google-spreadsheet");

class DocSetup {
  get doc() {
    return new GoogleSpreadsheet(
      //"1CfGPxISyKun9z3qV303FUrPiDD8DkWc6wgkM0L9tbG0" // Production database
      "1wkCtjK0iwjlgkr-UaXuVtG1EySjxS0XDad9cuF2HohY" //development database
    );
  }
}
const docSetup = new DocSetup();
Object.freeze(docSetup);

module.exports = {
  docSetup: docSetup,
};
