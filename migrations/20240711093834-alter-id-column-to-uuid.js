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


const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Step 1: Add a new UUID column
      await queryInterface.addColumn('users', 'newId', {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      }, { transaction });

      // Step 2: Copy the data from the old column to the new column
      const users = await queryInterface.sequelize.query(
        'SELECT * FROM users',
        { transaction, type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      for (const user of users) {
        await queryInterface.sequelize.query(
          `UPDATE users SET "newId" = '${uuidv4()}' WHERE id = ${user.id}`,
          { transaction }
        );
      }

      // Step 3: Drop the old primary key constraint
      await queryInterface.removeConstraint('users', 'users_pkey', { transaction });

      // Step 4: Drop the old column
      await queryInterface.removeColumn('users', 'id', { transaction });

      // Step 5: Rename the new column to the old column's name
      await queryInterface.renameColumn('users', 'newId', 'id', { transaction });

      // Step 6: Add the primary key constraint back
      await queryInterface.addConstraint('users', {
        fields: ['id'],
        type: 'primary key',
        name: 'users_pkey',
        transaction
      });

      // Repeat similar steps for the `organizations` table
      await queryInterface.addColumn('organizations', 'newId', {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      }, { transaction });

      const organizations = await queryInterface.sequelize.query(
        'SELECT * FROM organizations',
        { transaction, type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      for (const organization of organizations) {
        await queryInterface.sequelize.query(
          `UPDATE organizations SET "newId" = '${uuidv4()}' WHERE id = ${organization.id}`,
          { transaction }
        );
      }

      await queryInterface.removeConstraint('organizations', 'organizations_pkey', { transaction });
      await queryInterface.removeColumn('organizations', 'id', { transaction });
      await queryInterface.renameColumn('organizations', 'newId', 'id', { transaction });
      await queryInterface.addConstraint('organizations', {
        fields: ['id'],
        type: 'primary key',
        name: 'organizations_pkey',
        transaction
      });
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Reverting steps can be implemented here, if necessary
  }
};
