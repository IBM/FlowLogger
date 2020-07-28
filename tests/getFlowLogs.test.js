//run [npm install jest]
//in package.json, under script set test attribute value to "jest"
//run [npm test] in terminal to exectue tests

const axios = require("axios");
jest.mock("axios"); //mocking axios function
const getTokens = require("../backend/getFlowLogs.js").getTokens;
const getRegion = require("../backend/getFlowLogs.js").getRegion;
const getCollectors = require("../backend/getFlowLogs.js").getCollectors;
const formatCollectors = require("../backend/getFlowLogs.js").formatCollectors;

test("get tokens", async () => {
  //dummy api response data
  var tokenResponse = {
    data: {
      access_token: "eyJhbGciOiJIUz......sgrKIi8hdFs"
    }
  };
  axios.mockResolvedValue(tokenResponse);
  expect(await getTokens("G1234")).toBe("eyJhbGciOiJIUz......sgrKIi8hdFs");
});

test("get us south region", () => {
  expect(getRegion("1")).toStrictEqual([
    "us-south",
    "s3.us-south.cloud-object-storage.appdomain.cloud"
  ]);
});
test("get us east region", () => {
  expect(getRegion("2")).toStrictEqual([
    "us-east",
    "s3.us-east.cloud-object-storage.appdomain.cloud"
  ]);
});
test("get great britain region", () => {
  expect(getRegion("3")).toStrictEqual([
    "eu-gb",
    "s3.eu-gb.cloud-object-storage.appdomain.cloud"
  ]);
});
test("get german region", () => {
  expect(getRegion("4")).toStrictEqual([
    "eu-de",
    "s3.eu-de.cloud-object-storage.appdomain.cloud"
  ]);
});

test("get collectors in us east", async () => {
  var tokenResponse = {
    data: {
      flow_log_collectors: [
        {
          name: "dr-flowlog",
          storage_bucket: { name: "dr-us-east-bucket" }
        },
        {
          name: "dr-flowlog2",
          storage_bucket: { name: "dr-us-east-bucket" }
        }
      ]
    }
  };
  axios.mockResolvedValue(tokenResponse);
  expect(await getCollectors("1234", "us-east")).toBe(
    tokenResponse.data.flow_log_collectors
  );
});

test("format collectors", async () => {
  var inputData = {
    data: {
      flow_log_collectors: [
        {
          name: "dr-flowlog",
          storage_bucket: { name: "dr-us-east-bucket" }
        },
        {
          name: "dr-flowlog2",
          storage_bucket: { name: "dr-us-east-bucket" }
        }
      ]
    }
  };

  expect(formatCollectors(inputData.data.flow_log_collectors, 1)).toBe(
    "dr-us-east-bucket"
  );
});
