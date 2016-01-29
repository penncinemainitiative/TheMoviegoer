'use strict';

var fs = require('fs');
var mysql = require('mysql');
var mysqlObj = JSON.parse(fs.readFileSync('json/mysqldb.json', 'utf8'));
var connection = null;

function handleDisconnect() {
  connection = mysql.createPool(mysqlObj);

  connection.getConnection(function (err, connection) {
    if (err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    connection.release();
  });
  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = connection;