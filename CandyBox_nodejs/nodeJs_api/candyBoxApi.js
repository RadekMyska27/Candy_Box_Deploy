/* eslint-disable no-undef */
const express = require("express");
const app = express();
var cors = require("cors");

const date = new Date();

const candyType = { cracker: "cracker", drinks: "drinks", other: "other" };
const variableSymbol = getVariableSymbol();
const accountNumber = 2401867771;
const bankCode = 2010;

app.use(express.json()); //Bez tohoto middleware bychom v req.body nic nenašli.
app.use(cors());

app.get("/", (req, res) => {
  res.send("nodeJs__");
});

app.listen(3000, () => console.log("Listening on port 3000..."));

const { GoogleSpreadsheet } = require("google-spreadsheet");

const doc = new GoogleSpreadsheet(
  "1CfGPxISyKun9z3qV303FUrPiDD8DkWc6wgkM0L9tbG0"
);
const credentials = require("./client_secret.json");

async function candyBoxApiSet() {
  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];

  return sheet;
}

async function candyBoxRead() {
  var sheet = await candyBoxApiSet();
  console.log(sheet.headerValues);

  return sheet.headerValues;
}

async function candyBoxWrite(cellName = "", cellvalue = 0) {
  var sheet = await candyBoxApiSet();
  console.log(sheet.headerValues);

  var rows = await sheet.getRows();

  // cells rows 0 == headerValues can be set as name of heder value or by at rows _rawData[xy]
  // rows[0] == prvni radek

  var index = sheet.headerValues.indexOf(cellName);

  rows[0]._rawData[index] = cellvalue;
  rows[0].polozka = 20;
  rows[0].cena =
    parseInt(rows[0]._rawData[0], 10) + parseInt(rows[0]._rawData[1], 10);

  await rows[0].save();

  return rows[0].cena;
}

app.get("/api/nodeJsQuery", async (req, res) => {
  // volano jako asynchroni metoda viz async(req, res)
  try {
    var response = await candyBoxRead();
  } catch (error) {
    console.log(error);
  }
  res.send(response);
});

app.post("/api/nodeJsRequest", async (req, res) => {
  // volano jako asynchroni metoda viz async(req, res)
  try {
    var response = await candyBoxWrite(req.body.rowName, req.body.rowValue);
  } catch (error) {
    console.log(error);
  }
  res.send(response);
});

app.post("/api/nodeJsQR", (req, res) => {
  var amount = req.body.price;
  var message = req.body.message.toString();

  var urlApi =
    "https://api.paylibo.com/paylibo/generator/czech/image?accountNumber=" +
    accountNumber +
    "&bankCode=" +
    bankCode +
    "&amount=" +
    amount +
    "&currency=CZK&vs=" +
    variableSymbol +
    "&message=QR_PLATBA " +
    message;

  res.send(JSON.stringify({ img: urlApi })); // RESPONSE MUSI BYT POSLANA JAKO OBJEK JSON !!!
  console.log(
    getActualDate() +
      " QR CODE send with pay data: accountNumber " +
      accountNumber +
      "/" +
      bankCode +
      " amount " +
      amount +
      " CZK" +
      " message " +
      message
  );
});

app.post("/api/priceList", (req, res) => {
  // volano jako asynchroni metoda viz async(req, res)
  var priceList = [
    { id: 0, name: "croissant_maly", price: 20, type: candyType.cracker },
    { id: 1, name: "margotka", price: 15, type: candyType.cracker },
    { id: 2, name: "kitkat_klasik", price: 20, type: candyType.cracker },
    { id: 3, name: "kitkat_tycinka", price: 20, type: candyType.cracker },
    { id: 4, name: "mysli_tycinka", price: 15, type: candyType.cracker },
    { id: 5, name: "corny", price: 20, type: candyType.cracker },
    { id: 6, name: "polomacene_opl", price: 15, type: candyType.cracker },
    { id: 7, name: "twix", price: 20, type: candyType.cracker },
    { id: 8, name: "snickers", price: 20, type: candyType.cracker },
    { id: 9, name: "pernik", price: 10, type: candyType.cracker },
    { id: 10, name: "tratranky", price: 15, type: candyType.cracker },
    { id: 11, name: "kastany", price: 20, type: candyType.cracker },
    { id: 12, name: "minonky", price: 20, type: candyType.cracker },
    { id: 13, name: "bebe", price: 15, type: candyType.cracker },
    { id: 14, name: "croissant_max", price: 25, type: candyType.cracker },
    { id: 29, name: "zele_bonbon", price: 4, type: candyType.cracker },

    { id: 15, name: "birell", price: 25, type: candyType.drinks },
    { id: 16, name: "birell_ovocny", price: 25, type: candyType.drinks },
    { id: 17, name: "coca_cola", price: 25, type: candyType.drinks },
    { id: 18, name: "shock_330ml", price: 25, type: candyType.drinks },
    { id: 19, name: "red_bull_250ml", price: 40, type: candyType.drinks },
    { id: 20, name: "shock_500ml", price: 40, type: candyType.drinks },

    { id: 21, name: "polivka_sacek", price: 20, type: candyType.other },
    { id: 22, name: "polivka_kelimek", price: 40, type: candyType.other },
    { id: 23, name: "ovesna_kase", price: 15, type: candyType.other },
    { id: 24, name: "ryzova_kase", price: 20, type: candyType.other },
    { id: 25, name: "mandarinky", price: 35, type: candyType.other },
    { id: 26, name: "kukurice", price: 40, type: candyType.other },
    { id: 27, name: "olivy", price: 20, type: candyType.other },
    { id: 28, name: "bramburky", price: 20, type: candyType.other },
  ];
  res.send(JSON.stringify(priceList));
});

function getVariableSymbol() {
  return (
    date.getDate().toString() +
    date.getMonth().toString() +
    date.getFullYear().toString()
  );
}

function getActualDate() {
  return (
    date.getFullYear().toString() +
    ":" +
    date.getMonth().toString() +
    ":" +
    date.getDate().toString() +
    ":" +
    date.getHours().toString() +
    ":" +
    date.getMinutes().toString()
  );
}
