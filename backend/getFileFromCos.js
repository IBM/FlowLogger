const fs = require("fs");
const { gzip, ungzip } = require("node-gzip");
async function getData(cos, bucket, itemName) {
  return new Promise(function (resolve, reject) {
    cos.getObject({ Bucket: bucket, Key: itemName }, function (err, data) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(data);
    });
  });
}
function getBucketContents(bucketName, cosClient) {
  console.log(`Retrieving bucket contents from: ${bucketName}`);
  return cosClient
    .listObjects({ Bucket: bucketName })
    .promise()
    .then(async (data) => {
      if (data != null && data.Contents != null) {
        for (var i = 0; i < data.Contents.length; i++) {
          await getItem(bucketName, data.Contents[i].Key, cosClient);
        }
      }
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`.red);
    });
}

async function getItem(bucketName, itemName, cosClient) {
  let objectData = await getData(cosClient, bucketName, itemName);
  itemName = itemName.split("/");
  let fileName = itemName[itemName.length - 1];
  if (fileName.endsWith(".gz")) {
    let decompressed = await ungzip(Buffer.from(objectData.Body));
    fs.writeFile(
      "./logs/" + fileName.split(".")[0] + ".json",
      decompressed,
      function (err) {
        if (err) return console.log(err);
        console.log(fileName.split(".")[0] + ".json Written Successfully.");
      }
    );
  }
}
exports.getBucketContents = getBucketContents;
exports.getItem = getItem;
