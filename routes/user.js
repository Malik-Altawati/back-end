const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
const Profile = require("../models/Profile");
require("dotenv").config();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

///// get all users
router.get("/", (req, res) =>
  User.findAll()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.log(err);
      //  res.sendStatus(503)
    })
);

///// create a new user
router.post("/", (req, res) =>
  User.create(req.body)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.log(err);
      //  res.sendStatus(503)
    })
);

///// search for a user
router.get("/search", (req, res) => {
  const { name } = req.query;
  User.findAll({ where: { username: { [Op.like]: "%" + name + "%" } } })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      console.log(err);
      //  res.sendStatus(503)
    });
});

///// delete a user
router.get("/delete", (req, res) => {
  const { id } = req.query;
  User.destroy({ where: { id: id } })
    .then((data) => {
      if (data === 1) {
        console.log("Deleted successfully");
      }
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      // res.sendStatus(503)
    });
});

///// update user
router.post("/update", (req, res) => {
  const { id, email, username } = req.body;
  User.update({ email, username }, { where: { id } })
    .then((data) => {
      if (data === 1) {
        console.log("Updated successfully");
      }
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      // res.sendStatus(503)
    });
});

/*
───────────────────────────────────────────────────────────────────────────────────────────────
─██████████████─██████████─██████████████─██████──────────██████─██████──██████─██████████████─
─██░░░░░░░░░░██─██░░░░░░██─██░░░░░░░░░░██─██░░██████████──██░░██─██░░██──██░░██─██░░░░░░░░░░██─
─██░░██████████─████░░████─██░░██████████─██░░░░░░░░░░██──██░░██─██░░██──██░░██─██░░██████░░██─
─██░░██───────────██░░██───██░░██─────────██░░██████░░██──██░░██─██░░██──██░░██─██░░██──██░░██─
─██░░██████████───██░░██───██░░██─────────██░░██──██░░██──██░░██─██░░██──██░░██─██░░██████░░██─
─██░░░░░░░░░░██───██░░██───██░░██──██████─██░░██──██░░██──██░░██─██░░██──██░░██─██░░░░░░░░░░██─
─██████████░░██───██░░██───██░░██──██░░██─██░░██──██░░██──██░░██─██░░██──██░░██─██░░██████████─
─────────██░░██───██░░██───██░░██──██░░██─██░░██──██░░██████░░██─██░░██──██░░██─██░░██─────────
─██████████░░██─████░░████─██░░██████░░██─██░░██──██░░░░░░░░░░██─██░░██████░░██─██░░██─────────
─██░░░░░░░░░░██─██░░░░░░██─██░░░░░░░░░░██─██░░██──██████████░░██─██░░░░░░░░░░██─██░░██─────────
─██████████████─██████████─██████████████─██████──────────██████─██████████████─██████─────────
───────────────────────────────────────────────────────────────────────────────────────────────
*/

router.post("/signup", (req, res) => {
  var { password, email, username } = req.body;
  User.findOne({
    where: {
      [Op.or]: [{ email: email }, { username: username }],
    },
  })
    .then((users) => {
      if (users) {
        return res
          .status(200)
          .json({ status: false, message: "user or email is used" });
      } else {
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) throw err;
          password = hash;
          User.create({ username, email, password })
            .then((user) => {
              res.status(200).json({ status: true, message: user });
            })
            .catch((err) => {
              console.log(err);
              res.sendStatus(503);
            });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

/*
────────────────────────────────────────────────────────────────────────────────
─██████─────────██████████████─██████████████─██████████─██████──────────██████─
─██░░██─────────██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░██─██░░██████████──██░░██─
─██░░██─────────██░░██████░░██─██░░██████████─████░░████─██░░░░░░░░░░██──██░░██─
─██░░██─────────██░░██──██░░██─██░░██───────────██░░██───██░░██████░░██──██░░██─
─██░░██─────────██░░██──██░░██─██░░██───────────██░░██───██░░██──██░░██──██░░██─
─██░░██─────────██░░██──██░░██─██░░██──██████───██░░██───██░░██──██░░██──██░░██─
─██░░██─────────██░░██──██░░██─██░░██──██░░██───██░░██───██░░██──██░░██──██░░██─
─██░░██─────────██░░██──██░░██─██░░██──██░░██───██░░██───██░░██──██░░██████░░██─
─██░░██████████─██░░██████░░██─██░░██████░░██─████░░████─██░░██──██░░░░░░░░░░██─
─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░██─██░░██──██████████░░██─
─██████████████─██████████████─██████████████─██████████─██████──────────██████─
────────────────────────────────────────────────────────────────────────────────
*/

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30m",
  });
}

router.post("/login", (req, res) => {
  // takes name which can be username or email and a password
  var { password, name } = req.body;
  User.findOne({
    where: {
      [Op.or]: [{ email: name }, { username: name }],
    },
  }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          var payload = { name: user.username };
          const accessToken = generateAccessToken(payload);
          const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_SECRET
          );
          var data = { user_id: user.id, refreshToken };
          Token.create(data)
            .then((token) => {
              res.status(200).json({
                status: true,
                message: user,
                accessToken,
                refreshToken,
              });
            })
            .catch((err) => {
              console.log(err)
            });
        } else {
          res
            .status(200)
            .json({ status: false, message: "incorrect password" });
        }
      });
    } else {
      res.status(200).json({ status: false, message: "invalid user" });
    }
  });
});

/*

───────────────────────────────────────────────────────────────────────────────────────────
─██████─────────██████████████─██████████████─██████████████─██████──██████─██████████████─
─██░░██─────────██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░██──██░░██─██░░░░░░░░░░██─
─██░░██─────────██░░██████░░██─██░░██████████─██░░██████░░██─██░░██──██░░██─██████░░██████─
─██░░██─────────██░░██──██░░██─██░░██─────────██░░██──██░░██─██░░██──██░░██─────██░░██─────
─██░░██─────────██░░██──██░░██─██░░██─────────██░░██──██░░██─██░░██──██░░██─────██░░██─────
─██░░██─────────██░░██──██░░██─██░░██──██████─██░░██──██░░██─██░░██──██░░██─────██░░██─────
─██░░██─────────██░░██──██░░██─██░░██──██░░██─██░░██──██░░██─██░░██──██░░██─────██░░██─────
─██░░██─────────██░░██──██░░██─██░░██──██░░██─██░░██──██░░██─██░░██──██░░██─────██░░██─────
─██░░██████████─██░░██████░░██─██░░██████░░██─██░░██████░░██─██░░██████░░██─────██░░██─────
─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░██─────██░░██─────
─██████████████─██████████████─██████████████─██████████████─██████████████─────██████─────
───────────────────────────────────────────────────────────────────────────────────────────
*/
router.post("/logout", (req, res) => {
  var user_id = req.body.user_id;
  Token.destroy({ where: { user_id } })
    .then((data) => {
      if (data > 0) {
        res.status(200).json({
          status: true,
          message: "Refresh Token Deleted successfully",
        });
      }
      res.status(200).json({
        status: true,
        message: "No refreshToken with that user_Id",
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
