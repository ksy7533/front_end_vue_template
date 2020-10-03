const express = require("express");
const app = express();
const port = 8080;

const path = require("path");

app.set("views", path.join(__dirname, "../resources/templates"));

app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

app.get("/", function(req, res) {
  res.render("./index.html");
});

app.get("/book", function(req, res) {
  const data = [
    {
      price: 1000,
      tit: "test"
    }
  ];
  res
    .set({
      "content-type": "application/json"
    })
    .json(data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
