const colors = require("colors");
const fs = require("fs");

const logFolder = "../logs";
var problem = false;
function clearLogs() {
  if (!fs.existsSync(logFolder)) {
    return "Error, folder does not exist\n".red;
  } else if (fs.readdirSync(logFolder).length == 0) {
    return "Folder is already empty\n".yellow;
  }
  //deleteFolderRecursive(logFolder);
  if (problem) {
    return "Error, returning to home prompt...".red;
  }
  return "All files have been cleared\n".yellow;
}

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(curPath);
      } else {
        // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

module.exports.clearLogs = clearLogs;
