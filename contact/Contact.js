const Sequelize = require("sequelize");
const connection = require("../database/database");

const Contact = connection.define("contacts", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false
  },
  message: {
    type: Sequelize.TEXT,
    allowNull: false
  }
});

module.exports = Contact;
