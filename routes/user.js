const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Token = require("../models/Token");
const Profile = require("../models/Profile");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

///// get all users
router.get("/", (req, res) =>
  User.findAll()
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      console.log(err);
      //  res.sendStatus(503)
    })
);

///// create a new user
router.post("/", (req, res) =>
  User.create(req.body)
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => {
      console.log(err);
      //  res.sendStatus(503)
    })
);

///// search for a user
router.get("/search", (req, res) => {
  const { name } = req.query;
  User.findAll({ where: { username: { [Op.like]: "%" + name + "%" } } })
    .then(users => {
      res.status(200).send(users);
    })
    .catch(err => {
      console.log(err);
      //  res.sendStatus(503)
    });
});

///// delete a user
router.get("/delete", (req, res) => {
  const { id } = req.query;
  User.destroy({ where: { id: id } })
    .then(data => {
      if (data === 1) {
        console.log("Deleted successfully");
      }
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
      // res.sendStatus(503)
    });
});

///// update user
router.post("/update", (req, res) => {
  const { id, email, username } = req.body;
  User.update({ email, username }, { where: { id } })
    .then(data => {
      if (data === 1) {
        console.log("Updated successfully");
      }
      res.sendStatus(200);
    })
    .catch(err => {
      console.log(err);
      // res.sendStatus(503)
    });
});

module.exports = router;
