const readline = require("readline-sync");
const myCOS = require("ibm-cos-sdk");
var config = {
  endpoint: "",
  apiKeyId: "",
};
var cosClient;
const getCollectors = require("./backend/getFlowLogs");
const getCOS = require("./backend/getFileFromCos");

var main = async function () {
  do {
    var option;
    option = readline.question(`choose option
        1. get flowlogs
        2. exit
        \n`);

    switch (option) {
      case "1":
        if (config.apiKeyId == "") {
          var apiKey = readline.question(`Please enter your API Key:
                        \n`);
          // Get bucketName and region endpoint
          config.apiKeyId = apiKey;
        }
        var output = await getCollectors(apiKey);
        var bucketName = (bucketName = output[0]);
        config.endpoint = output[1];
        cosClient = new myCOS.S3(config);
        // Retrieve all items from the COS bucket
        await getCOS.getBucketContents(bucketName, cosClient);
        break;

      case "2":
        console.log("exiting...\n\n\n\n\n");
        option = -1;
        break;

      default:
        console.log("invalid option\n\n\n\n\n");
    }
  } while (option != -1);
};
main();
module.exports.collectors = "";
