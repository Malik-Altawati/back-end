const Sequelize = require("sequelize");
const db = require("../config/database");

const User = require("./User");

const Token = db.define("token", {
  refreshToken: {
    type: Sequelize.STRING
  }
});

User.hasOne(Token, { foreignKey: "user_id" });

db.sync()
  .then(() => console.log("tokens table is up"))
  .catch(err => console.log(`Error### ${err}`));

module.exports = Token;
