const Sequelize = require("sequelize");
const db = require("../config/database");

db.sync()
  .then(() => console.log("users table is up"))
  .catch(err => console.log(`Error### ${err}`));

const User = db.define("user", {
  username: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
});

module.exports = User;
