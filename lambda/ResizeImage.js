var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm').subClass({ imageMagick: true }); // Enable ImageMagick integration.
var util = require('util');

var widths = [800, 600, 400, 200];

// get reference to S3 client 
var s3 = new AWS.S3();

exports.handler = function(event, context, callback) {
  // Read options from the event.
  console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
  var srcBucket = event.Records[0].s3.bucket.name;
  // Object key may have spaces or unicode non-ASCII characters.
  var srcKey    =
    decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));  
  var dstBucket = "moviegoer-images";

  // Sanity check: validate that source and destination are different buckets.
  if (srcBucket == dstBucket) {
    callback("Source and destination buckets are the same.");
    return;
  }

  // Infer the image type.
  var typeMatch = srcKey.match(/\.([^.]*)$/);
  if (!typeMatch) {
    callback("Could not determine the image type.");
    return;
  }
  var imageType = typeMatch[1];
  if (imageType != "jpg" && imageType != "png") {
    callback('Unsupported image type: ${imageType}');
    return;
  }

  var upload = function (contentType, data, width, complete) {
    // Stream the transformed image to a different S3 bucket.
    var dstKey = srcKey.replace(".", "-" + width + "w.");
    s3.putObject({
      Bucket: dstBucket,
      Key: dstKey,
      Body: data,
      ContentType: contentType,
      CacheControl: 'public ,max-age= 31536000'
    },
    complete);
  };

  // Download the image from S3, resize, and upload
  s3.getObject({
    Bucket: srcBucket,
    Key: srcKey
  }, function (err, response) {
    var resizeFunctions = widths.map(function (width) {
      return function (complete) {
        gm(response.Body).resize(width)
          .toBuffer(imageType, function(err, buffer) {
            if (err) {
              complete(err);
            } else {
              upload(response.ContentType, buffer, width, complete);
            }
          });
      };
    });
    async.parallel(resizeFunctions, function (err, results) {
      if (err) {
        console.error('Unable to resize ' + srcBucket + '/' + srcKey +
            'due to an error: ' + err);
      } else {
        console.log('Successfully resized ' + srcBucket + '/' + srcKey);
      }
      callback(null, "message");
    });
  });
};
