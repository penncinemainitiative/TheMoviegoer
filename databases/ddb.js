'use strict';

var fs = require('fs');
var awsObj = JSON.parse(fs.readFileSync('json/aws.json', 'utf8'));
module.exports = require('dynamodb').ddb({
  accessKeyId: awsObj.accessKeyId,
  secretAccessKey: awsObj.secretAccessKey,
  region: "us-east-1"
});