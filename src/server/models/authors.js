module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authors', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isEditor: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    assignedEditor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'authors'
  });
};
