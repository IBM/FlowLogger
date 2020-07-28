const fs = require("fs");
const { gzip, ungzip } = require("node-gzip");
function getData(cos, bucket, itemName) {
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

async function getBucketContents(bucketName, cosClient) {
  console.log(`Retrieving bucket contents from: ${bucketName}`);
  return cosClient
    .listObjects({ Bucket: bucketName })
    .promise()
    .then(async (data) => {
      let promises = [];
      if (data != null && data.Contents != null)
        for (var i = 0; i < data.Contents.length; i++) {
          promises.push(getItem(bucketName, data.Contents[i].Key, cosClient));
        }
      console.log("Found " + promises.length + " items.");
      await Promise.all(promises);
    })
    .catch((e) => {
      console.error(`ERROR: ${e.code} - ${e.message}\n`.red);
    });
}
async function getItem(bucketName, itemName, cosClient) {
  let objectData = await getData(cosClient, bucketName, itemName);
  itemName = itemName.split("/");
  let fileName = itemName[itemName.length - 1];
  try {
    if (
      fs.existsSync(
        "./logs/" + bucketName + "/" + fileName.split(".")[0] + ".json"
      )
    ) {
      console.log(fileName.split(".")[0] + ".json already exists.");
    } else {
      if (fileName.endsWith(".gz")) {
        let decompressed = await ungzip(Buffer.from(objectData.Body));
        var dir = "./logs";
        var dir2 = "./logs/" + bucketName;
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        if (!fs.existsSync(dir2)) {
          fs.mkdirSync(dir2);
        }
        fs.writeFile(
          dir2 + "/" + fileName.split(".")[0] + ".json",
          decompressed,
          function (err) {
            if (err) console.log(err);
            console.log(fileName.split(".")[0] + ".json Written Successfully.");
          }
        );
      }
    }
  } catch (err) {
    console.error(err);
  }
}
exports.getBucketContents = getBucketContents;
exports.getItem = getItem;
