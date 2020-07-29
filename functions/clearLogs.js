const colors = require("colors");
const fs = require("fs");
const logFolder = "./logs";
var problem = false;
function clearLogs() {
  if (fs.readdirSync(logFolder).length == 0) {
    console.log("Folder is already empty\n".yellow);
    return;
  }
  fs.readdirSync(logFolder).forEach(file => {
    try {
      fs.unlinkSync(logFolder + "/" + file);
    } catch (error) {
      problem = true;
    }
  });
  if (problem) {
    console.log("Error, returning to home prompt...".red);
  }
  console.log("All files have been cleared\n".yellow);
}
module.exports.clearLogs = clearLogs;
