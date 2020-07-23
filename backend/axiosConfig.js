const axios = require("axios");

const axiosInstance = axios.default.create({
  baseURL: "https://iam.cloud.ibm.com/identity/token"
});

module.exports = axiosInstance;
