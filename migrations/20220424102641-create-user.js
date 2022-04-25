'use strict';
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING
      },
       email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    return queryInterface.bulkInsert('Users', [{
      fullName: 'Nguyễn Mạnh Cường',
      email: 'muadongyeuthuong3x@gmail.com',
      password: await bcrypt.hash("12345678",saltRounds),
      phoneNumber:'0346997607',
      role:"Admin",
      address:'Học viện kĩ thuật mật mã',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};

