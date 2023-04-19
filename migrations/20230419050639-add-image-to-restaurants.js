'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Restaurants', 'image', {
      type: Sequelize.STRING
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Restaurants', 'image')
  }
};
