const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const app = express();

app.use(express.static(path.join(__dirname, "../build")));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static("dist"));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://recipe-app-351220.uc.r.appspot.com");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(process.env.PORT || 8080, () => console.log(`Hello World!. Listening on port ${process.env.PORT || 8080}!`));
