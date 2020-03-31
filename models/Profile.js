const Sequelize = require("sequelize");
const db = require("../config/database");

const User = require("./User");

const Profile = db.define("profile", {
  firstname: {
    type: Sequelize.STRING
  },
  lastname: {
    type: Sequelize.STRING
  },
  img: {
    type: Sequelize.STRING
  },
  gender: {
    type: Sequelize.CHAR
  },
  birhday: {
    type: Sequelize.DATE
  },
  phonenumber: {
    type: Sequelize.INTEGER
  }
});

User.hasOne(Profile, { foreignKey: "user_id" });

db.sync()
  .then(() => console.log("profiles table is up"))
  .catch(err => console.log(`Error### ${err}`));

module.exports = Profile;
