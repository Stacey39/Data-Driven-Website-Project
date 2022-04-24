const Sequelize = require('sequelize');

const sequelize = new Sequelize('nodelogin', 'newuser', 'newuser1234', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;