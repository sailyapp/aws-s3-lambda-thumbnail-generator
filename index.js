var async = require("async");
var AWS = require("aws-sdk");
var gm = require("gm").subClass({imageMagick: true});
var fs = require("fs");
var mktemp = require("mktemp");

var THUMB_KEY_PREFIX = "thumbnails/",
    THUMB_WIDTH = 300,
    THUMB_HEIGHT = 300,
    ALLOWED_FILETYPES = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'pdf', 'gif'];

var utils = {
  decodeKey: function(key) {
    return decodeURIComponent(key).replace(/\+/g, ' ');
  }
};


var s3 = new AWS.S3();


exports.handler = function(event, context) {
  var bucket = event.Records[0].s3.bucket.name,
  srcKey = utils.decodeKey(event.Records[0].s3.object.key),
  dstKey = THUMB_KEY_PREFIX + srcKey.replace(/\.\w+$/, ".jpg"),
  fileType = srcKey.match(/\.\w+$/);

  if(srcKey.indexOf(THUMB_KEY_PREFIX) === 0) {
    return;
  }

  if (fileType === null) {
    console.error("Invalid filetype found for key: " + srcKey);
    return;
  }

  fileType = fileType[0].substr(1);

  if (ALLOWED_FILETYPES.indexOf(fileType) === -1) {
    console.error("Filetype " + fileType + " not valid for thumbnail, exiting");
    return;
  }

  async.waterfall([

    function download(next) {
        //Download the image from S3
        s3.getObject({
          Bucket: bucket,
          Key: srcKey
        }, next);
      },

      function createThumbnail(response, next) {
        var temp_file, image;

        if(fileType === "pdf") {
          temp_file = mktemp.createFileSync("/tmp/XXXXXXXXXX.pdf")
          fs.writeFileSync(temp_file, response.Body);
          image = gm(temp_file + "[0]");
        } else if (fileType === 'gif') {
          temp_file = mktemp.createFileSync("/tmp/XXXXXXXXXX.gif")
          fs.writeFileSync(temp_file, response.Body);
          image = gm(temp_file + "[0]");
        } else {
          image = gm(response.Body);
        }

        image.size(function(err, size) {
          /*
           * scalingFactor should be calculated to fit either the width or the height
           * within 150x150 optimally, keeping the aspect ratio. Additionally, if the image 
           * is smaller than 150px in both dimensions, keep the original image size and just 
           * convert to png for the thumbnail's display
           */
          var scalingFactor = Math.min(1, THUMB_WIDTH / size.width, THUMB_HEIGHT / size.height),
          width = scalingFactor * size.width,
          height = scalingFactor * size.height;

          this.resize(width, height)
          .toBuffer("jpg", function(err, buffer) {
            if(temp_file) {
              fs.unlinkSync(temp_file);
            }

            if (err) {
              next(err);
            } else {
              next(null, response.contentType, buffer);
            }
          });
        });
      },

      function uploadThumbnail(contentType, data, next) {
        s3.putObject({
          Bucket: bucket,
          Key: dstKey,
          Body: data,
          ContentType: "image/jpg",
          ACL: 'public-read',
          Metadata: {
            thumbnail: 'TRUE'
          }
        }, next);
      }

      ],
      function(err) {
        if (err) {
          console.error(
            "Unable to generate thumbnail for '" + bucket + "/" + srcKey + "'" +
            " due to error: " + err
            );
        } else {
          console.log("Created thumbnail for '" + bucket + "/" + srcKey + "'");
        }

        context.done();
      });
};
