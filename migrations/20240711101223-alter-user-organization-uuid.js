'use strict';

/** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add altering commands here.
//      *
//      * Example:
//      * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
//      */
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add reverting commands here.
//      *
//      * Example:
//      * await queryInterface.dropTable('users');
//      */
//   }
// };

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop default constraints first
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ALTER COLUMN id DROP DEFAULT;

      ALTER TABLE organizations
      ALTER COLUMN id DROP DEFAULT;
    `);

    // Alter columns to use UUID type and set default
    await queryInterface.sequelize.query(`
      ALTER TABLE users
      ALTER COLUMN id SET DATA TYPE uuid USING (uuid_generate_v4()),
      ALTER COLUMN id SET DEFAULT uuid_generate_v4();

      ALTER TABLE organizations
      ALTER COLUMN id SET DATA TYPE uuid USING (uuid_generate_v4()),
      ALTER COLUMN id SET DEFAULT uuid_generate_v4();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop default constraints in reverse order
    await queryInterface.sequelize.query(`
      ALTER TABLE organizations
      ALTER COLUMN id SET DATA TYPE integer,
      ALTER COLUMN id DROP DEFAULT;

      ALTER TABLE users
      ALTER COLUMN id SET DATA TYPE integer,
      ALTER COLUMN id DROP DEFAULT;
    `);
  }
};
