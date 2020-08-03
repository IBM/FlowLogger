const readline = require("readline-sync");
const colors = require("colors");

const axios = require("axios");
const qs = require("qs");

var bucketName = "";
var problem = false;

var region = "";
// getting token to perform api requests
async function getTokens(apikey) {
  var access_token = "";
  await axios({
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json"
    },
    url: "https://iam.cloud.ibm.com/identity/token",
    data: qs.stringify({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apikey
    })
  })
    .then(async res => {
      access_token = res.data.access_token;
    })
    .catch(error => {
      console.log(error);
      problem = true;
    });

  return access_token;
}
// collecting available flow log collectors for specified region
async function getCollectors(access_token, region) {
  flowLogCollectors = "";
  if (problem) return null;

  await axios({
    method: "get",
    headers: { Authorization: "Bearer " + access_token },
    url:
      "https://" +
      region +
      ".iaas.cloud.ibm.com/v1/flow_log_collectors?version=2020-06-30&generation=2"
  })
    .then(async res => {
      flowLogCollectors = res.data.flow_log_collectors;
    })
    .catch(error => {
      console.log(error);
      problem = true;
    });
  if (problem) return null;
  regionEndpoint = "s3." + region + ".cloud-object-storage.appdomain.cloud";

  return flowLogCollectors;
}
//getting region
function getRegion(regionOption) {
  var regionEndpoint = "";
  do {
    var loop = false;
    if (regionOption == null) {
      regionOption = readline.question(`
    Select Region
        1. US South
        2. US East
        3. United Kingdom
        4. EU Germany
        \n`);
    }
    switch (regionOption) {
      case "1":
        region = "us-south";
        break;
      case "2":
        region = "us-east";
        break;
      case "3":
        region = "eu-gb";
        break;
      case "4":
        region = "eu-de";
        break;
      case "q":
        region = "q";
        break;
      default:
        console.log("Invalid region");

        regionOption = null;
        loop = true;
    }
  } while (loop == true);
  regionEndpoint = "s3." + region + ".cloud-object-storage.appdomain.cloud";
  return [region, regionEndpoint];
}
// styling the json data
function formatCollectors(collectors, option) {
  var i = 1;
  if (collectors.length > 0) console.log("name        bucket");
  for (var item in collectors) {
    console.log(
      i +
        ". " +
        collectors[item].name +
        "  " +
        collectors[item].storage_bucket.name
    );
    i++;
  }
  if (collectors.length == 1) bucketName = collectors[0].storage_bucket.name;
  else if (collectors.length > 0) {
    do {
      if (
        isNaN(option) ||
        option == "" ||
        option < 1 ||
        option > collectors.length ||
        option == null
      ) {
        option = readline.question(
          `
            Select a bucket from 1 to ` +
            collectors.length +
            `:
                \n`
        );
        if (
          isNaN(option) ||
          option == "" ||
          option < 1 ||
          option > collectors.length ||
          option == null
        ) {
          console.log("Invalid option.\n");
        }
      }
    } while (
      isNaN(option) ||
      option == "" ||
      option < 1 ||
      option > collectors.length
    );
    bucketName = collectors[option - 1].storage_bucket.name;
    console.log(bucketName);
    return bucketName;
  } else {
    console.log("No Flow Log Collectors Found".yellow);
    problem = true;
  }
}
async function main(apikey) {
  var access_token = await getTokens(apikey);
  var regionAndEndpoint = getRegion();
  var region = regionAndEndpoint[0];
  var endpoint = regionAndEndpoint[1];
  var flowLogCollectors = await getCollectors(access_token, region);
  var bucketName = formatCollectors(flowLogCollectors);

  return [bucketName, endpoint];
}
module.exports = getCollectors;
module.exports.getRegion = getRegion;
module.exports.getTokens = getTokens;
module.exports.main = main;
module.exports.getCollectors = getCollectors;
module.exports.formatCollectors = formatCollectors;