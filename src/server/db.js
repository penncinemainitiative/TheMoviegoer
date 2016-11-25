import fs from 'fs'
import Sequelize from 'sequelize'
import articles from './models/articles'
import authors from './models/authors'
import drafts from './models/drafts'
import images from './models/images'

const mysqlConfig = JSON.parse(fs.readFileSync('json/mysqldb.json', 'utf8'));

const sequelize = new Sequelize(mysqlConfig.database, mysqlConfig.user, mysqlConfig.password, {
  host: mysqlConfig.host,
  dialect: 'mysql',
  pool: {
    max: 10,
    min: 0,
    idle: 10000
  }
});

const Article = articles(sequelize, Sequelize.DataTypes);
const Author = authors(sequelize, Sequelize.DataTypes);
const Draft = drafts(sequelize, Sequelize.DataTypes);
const Image = images(sequelize, Sequelize.DataTypes);

export { Article, Author, Draft, Image };