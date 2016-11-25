module.exports = function(sequelize, DataTypes) {
  return sequelize.define('articles', {
    articleId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    isPublished: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    pubDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updateDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    assignedEditor: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'articles'
  });
};
