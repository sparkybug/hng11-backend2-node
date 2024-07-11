const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Organization = sequelize.define('Organization', {
    orgId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  });

  Organization.associate = (models) => {
    Organization.belongsToMany(models.User, {
      through: 'UserOrganizations',
      foreignKey: 'orgId',
      otherKey: 'userId',
    });
  };

  return Organization;
};
