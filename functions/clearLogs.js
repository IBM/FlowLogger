const colors = require("colors");
const logFolder = "./logs";
function clearLogs() {
  console.log("Clearing all files".yellow);
  console.log("All files have been cleared\n".yellow);
}
module.exports.clearLogs = clearLogs;
