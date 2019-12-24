const Sequelize = require("sequelize");

const connection = new Sequelize("blog_painel", "edp2013", "34860760Du", {
  host: "mysql669.umbler.com",
  dialect: "mysql",
  timezone: "-03:00"
});

module.exports = connection;
