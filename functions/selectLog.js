const logFolder = "./logs";
const fs = require("fs");
const readline = require("readline-sync");
const colors = require("colors");

function selectLog(selection) {
  var count = 1;
  var files = {};
  //var selection = 0;

  if (!fs.existsSync(logFolder)) {
    console.log("Folder does not exist".yellow);
    return null;
  } else if (fs.readdirSync(logFolder).length == 0) {
    console.log("Folder does not exist".yellow);
    return null;
  }
  console.log("\n");
  fs.readdirSync(logFolder).forEach(file => {
    files[count] = file;
    console.log(count + ". " + file);
    count++;
  });
  do {
    if (
      isNaN(selection) ||
      selection == "" ||
      parseInt(selection) <= 0 ||
      parseInt(selection) >= count
    ) {
      selection = readline.question(`\nselect log\n`);
    }
    if (
      isNaN(selection) ||
      selection == "" ||
      parseInt(selection) <= 0 ||
      parseInt(selection) >= count
    ) {
      console.log("invalid option");
    }
  } while (
    isNaN(selection) ||
    selection == "" ||
    parseInt(selection) <= 0 ||
    parseInt(selection) >= count
  );

  return require("../logs/" + files[selection]);
}

module.exports.selectLog = selectLog;
