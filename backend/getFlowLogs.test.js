//run npm install jest
//in package.json, under script set test attribute value to "jest"
const axios = require("axios");
axios.defaults.adapter = require("axios/lib/adapters/http"); //this line is required to perform test with axios ,else you will get a server error
const getTokens = require("./getFlowLogs.js").getTokens;
test("get tokens", async () => {
  expect(await getTokens(process.env.apikey)).toBe(200); //set environment variable with your apikey
});
