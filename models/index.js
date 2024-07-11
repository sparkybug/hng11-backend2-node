const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize);
db.Organization = require('./organization')(sequelize);

db.User.belongsToMany(db.Organization, {
  through: 'UserOrganizations',
  foreignKey: 'userId',
  otherKey: 'orgId',
});

db.Organization.belongsToMany(db.User, {
  through: 'UserOrganizations',
  foreignKey: 'orgId',
  otherKey: 'userId',
});

module.exports = db;
