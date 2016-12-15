import fs from "fs"
import mysql from "mysql"
import Connection from "mysql/lib/Connection"
import Pool from "mysql/lib/Pool"
import Promise from "bluebird"

Promise.promisifyAll([
  Connection,
  Pool
]);

const config = JSON.parse(fs.readFileSync('json/mysqldb.json', 'utf8'));
const db = mysql.createPool(config);

export {db};