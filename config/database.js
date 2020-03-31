const { Sequelize } = require("sequelize");

//  module.exports = new Sequelize('postgres://hlfafcjr:192SGFDeuKEzFhsQPxJVgiUVTagkNB7D@drona.db.elephantsql.com:5432/hlfafcjr') // Example for postgres
module.exports = new Sequelize("postgres", "postgres", "123456", {
  host: "localhost",
  dialect: "postgres"

  // pool:{
  //     max: 5,
  //     min:0,
  //     acquire:30000,
  //     idle:10000
  // }
});
