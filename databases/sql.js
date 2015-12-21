'use strict';

var fs = require('fs');
var mysql = require('mysql');
var mysqlObj = JSON.parse(fs.readFileSync('json/mysqldb.json', 'utf8'));
module.exports = mysql.createConnection({
  host: mysqlObj.host,
  user: mysqlObj.user,
  password: mysqlObj.password,
  port: mysqlObj.port,
  database: mysqlObj.database
});