const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const express = require("express");
const app = express();
const addUsers = require("./database/UserEntity");
const dotenv = require("dotenv");
const {OAuth2Client} = require("google-auth-library");

dotenv.config();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

app.use(helmet());

app.use(express.json())

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use(morgan("combined"));

// Used by certain endpoints for verification
async function verify(token, email) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID
  });
  const payload = ticket.getPayload();
  return payload.email == email;
}

// Test API method 
app.get("/test", (req, res) => {
  res.status(200).send("Hello World!");
});

// TODO (issue 12): post for /users endpoint
app.post("/users", (req, res) => {
  addUsers(req.body);  
});

app.get("/recipes", (req, res) => {

});

app.post("/recipes", (req, res) => {

});

app.delete("/recipes", (req, res) => {

});

app.put("/recipes", (req, res) => {

});

app.use(express.static(path.join(__dirname, "../build")));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});
module.exports = app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
