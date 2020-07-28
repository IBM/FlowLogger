const readline = require("readline-sync");
const myCOS = require("ibm-cos-sdk");
const config = {
  endpoint: "",
  apiKeyId: "IvFGFLLYyQz3z4n_Ts8SXVgm6ofec-LzFyAr7hPG-hHk",
};
const getCollectors = require("./backend/getFlowLogs");
const getCOS = require("./backend/getFileFromCos");

const main = async function () {
  var option;
  while (true) {
    if (option != "wait")
      option = readline.question(`choose option
        1. get flowlogs
        q. return to home prompt
        \n`);

    switch (option) {
      case "1":
        if (config.apiKeyId == "") {
          config.apiKeyId = readline.question(`Please enter your API Key:
                        \n`);
        }
        if (config.apiKeyId == "q") {
          config.apiKeyId = "";
          console.log("returning...\n\n\n\n\n");
          return;
        }
        // Get bucketName and region endpoint
        const collectors = await getCollectors(config.apiKeyId);
        if (collectors == "q") return;
        if (collectors != null) {
          const bucketName = collectors[0];
          config.endpoint = collectors[1];
          var cosClient = new myCOS.S3(config);
          // Retrieve all items from the COS bucket
          await getCOS.getBucketContents(bucketName, cosClient);
        } else {
          config.apiKeyId = "";
          console.log("Error, returning to home prompt...".red);
          return;
        }
        break;
      case "q":
        console.log("returning...\n\n\n\n\n");
        return;

      default:
        console.log("invalid option\n\n\n\n\n");
    }
  }
};
module.exports.main = main;
module.exports.collectors = "";
