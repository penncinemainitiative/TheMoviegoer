module.exports = function(sequelize, DataTypes) {
  return sequelize.define('images', {
    image: {
      type: DataTypes.STRING,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'images'
  });
};
