var url = "http://localhost:3000/api/nodeJsRequest";

var submit_btns = document.getElementsByName("user");
var data = document.querySelectorAll("#post_btn"); // predani hodnoty buttonu pro body req

var testbody = {
  rowName: "neco",
  rowValue: 0,
};

for (let i = 0; i < submit_btns.length; i++) {
  submit_btns[i].addEventListener("click", async function () {
    // test zapisu do hml obsahu
    var head = document.getElementById("homePage");
    head.innerHTML = "User " + data[i].dataset.rowvalue;

    console.log("button press " + data[i].dataset.rowvalue);

    testbody.rowValue = data[i].dataset.rowvalue;

    let response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(testbody),
      headers: new Headers({
        "content-type": "text/html",
      }),
    })
      .then(async function (response) {
        var result = await response.json();
        console.log("result: " + result);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

// submit_btn.addEventListener("click", async function () {
//   console.log("button press");
//   let response = await fetch(url, {
//     method: "POST",
//     body: JSON.stringify(body),
//     headers: new Headers({
//       "content-type": "application/json",
//     }),
//   })
//     .then(async function (response) {
//       var result = await response.json();
//       console.log("result: " + result);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// });
