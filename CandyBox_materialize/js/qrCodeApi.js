function getQrImageApi() {
  const url = "http://" + urlIp + ":3000/api/QrCodeQuery"; //http://localhost:3000/api/QrCodeQuery

  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      price: getPriceToPay(),
      message: getCandiesNamesToPay(),
    }),
  })
    .then(async function (response) {
      const result = await response.json();
      if (getPriceToPay() !== 0) {
        //TODO investigate if condition is needed
        payQrImage.src = result.img;
        stopLoader();
      }
    })
    .catch(function (error) {
      console.log(error);
      stopLoader();
    });
}

function getDepositQrImageApi() {
  const url = "http://" + urlIp + ":3000/api/QrCodeQuery"; //http://localhost:3000/api/QrCodeQuery

  fetch(url, {
    method: "POST",
    headers: new Headers({
      "content-type": "application/json",
    }),
    body: JSON.stringify({
      price: depositValueInput.value,
      message: "vklad_uzivatel_" + userName,
    }),
  })
    .then(async function (response) {
      const result = await response.json();
      depositQrImage.src = result.img;
    })
    .catch(function (error) {
      console.log(error);
    });
}
