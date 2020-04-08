const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
const jwt = require("jsonwebtoken");
//
const User = require("./models/User");
const Token = require("./models/Token");
//

//Database
const db = require("./config/database");

// test db
db.authenticate()
  .then(() => console.log("db connected..."))
  .catch((err) => console.log(`ERROR### ${err}`));

const app = express();
// app.use(express.static(__dirname + "/public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/", authenticateToken, (req, res) => res.send("authenticated"));

function authenticateToken(req, res, next) {
  var authHeader = req.headers["authorization"];
  var token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

app.post("/token", (req, res) => {
  var refreshToken = req.body.token;
  if (refreshToken == null)
    return res
      .status(200)
      .json({ status: false, message: "no refresh token received" });

  Token.findOne({ where: { refreshToken } })
    .then((user) => {
      if (!user) {
        return res
          .status(200)
          .json({ status: false, message: "invalid refreshtoken" });
      }
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) return res.status(200).json({ status: false, message: err });
          const accessToken = generateAccessToken({ name: user.username });
          res.status(200).json({ status: true, accessToken });
        }
      );
    })
    .catch((err) => {
      console.log(err);
    });
});

// user routes
app.use("/user", require("./routes/user"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
