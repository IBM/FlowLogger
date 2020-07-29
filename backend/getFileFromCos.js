const readline = require("readline-sync");
const fs = require("fs");
const colors = require("colors");
function getBucketContents(bucketName, cosClient) {
  console.log(`Retrieving bucket contents from: ${bucketName}`);
  return cosClient
    .listObjects({ Bucket: bucketName })
    .promise()
    .then(async data => {
      if (data != null && data.Contents != null) {
        for (var i = 0; i < data.Contents.length; i++) {
          await getItem(bucketName, data.Contents[i].Key, cosClient);
        }
      }
    })
    .catch(e => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`.red);
    });
}
function getItem(bucketName, itemName, cosClient) {
  console.log(`Retrieving item from bucket: ${bucketName}, key: ${itemName}`);
  return cosClient
    .getObject({
      Bucket: bucketName,
      Key: itemName
    })
    .promise()
    .then(data => {
      if (data != null) {
        try {
          fs.writeFileSync(
            "./logs/" + itemName,
            Buffer.from(data.Body).toString()
          );
          console.log("File written successfully");
        } catch (err) {
          console.error(err);
        }
      }
    })
    .catch(e => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
}
exports.getBucketContents = getBucketContents;
exports.getItem = getItem;
