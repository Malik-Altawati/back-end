const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

//Database
const db = require("./config/database");
// test db
db.authenticate()
  .then(() => console.log("db connected..."))
  .catch(err => console.log(`ERROR### ${err}`));

const app = express();
// app.use(express.static(__dirname + "/public"));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("hi"));

// user routes
app.use("/user", require("./routes/user"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running on port ${PORT}`));
