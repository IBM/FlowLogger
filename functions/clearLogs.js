const colors = require("colors");
const fs = require("fs");
const logFolder = "./logs";
var problem = false;
function clearLogs() {
  if (!fs.existsSync(logFolder)) {
    return "Error, folder does not exist\n".red;
  } else if (fs.readdirSync(logFolder).length == 0) {
    return "Folder is already empty\n".yellow;
  }
  fs.readdirSync(logFolder).forEach(file => {
    try {
      fs.unlinkSync(logFolder + "/" + file);
    } catch (error) {
      problem = true;
    }
  });
  if (problem) {
    return "Error, returning to home prompt...".red;
  }
  return "All files have been cleared\n".yellow;
}
module.exports.clearLogs = clearLogs;
