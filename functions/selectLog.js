const fs = require("fs");
const readline = require("readline-sync");
const colors = require("colors");

function selectLog(folderSelection, fileSelection) {
  var logFolder = "./logs";
  var count = 1;
  var folders = {};
  var files = {};
  //var selection = 0;
  if (!fs.existsSync(logFolder)) {
    console.log("Folder does not exist".yellow);
    return null;
  } else if (fs.readdirSync(logFolder).length == 0) {
    console.log("Folder is empty".yellow);
    return null;
  }
  fs.readdirSync(logFolder).forEach(folder => {
    folders[count] = folder;
    console.log(count + ". " + folder);
    count++;
  });

  do {
    if (
      isNaN(folderSelection) ||
      folderSelection == "" ||
      parseInt(folderSelection) <= 0 ||
      parseInt(folderSelection) >= count
    ) {
      folderSelection = readline.question(`\nselect log\n`);
    }
    if (
      isNaN(folderSelection) ||
      folderSelection == "" ||
      parseInt(folderSelection) <= 0 ||
      parseInt(folderSelection) >= count
    ) {
      console.log("invalid option");
    }
  } while (
    isNaN(folderSelection) ||
    folderSelection == "" ||
    parseInt(folderSelection) <= 0 ||
    parseInt(folderSelection) >= count
  );
  //console.log(folders[folderSelection]);
  count = 1;
  logFolder = logFolder + "/" + folders[folderSelection];

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
      isNaN(fileSelection) ||
      fileSelection == "" ||
      parseInt(fileSelection) <= 0 ||
      parseInt(fileSelection) >= count
    ) {
      fileSelection = readline.question(`\nselect log\n`);
    }
    if (
      isNaN(fileSelection) ||
      fileSelection == "" ||
      parseInt(fileSelection) <= 0 ||
      parseInt(fileSelection) >= count
    ) {
      console.log("invalid option");
    }
  } while (
    isNaN(fileSelection) ||
    fileSelection == "" ||
    parseInt(fileSelection) <= 0 ||
    parseInt(fileSelection) >= count
  );

  return require("." + logFolder + "/" + files[fileSelection]);
}

module.exports.selectLog = selectLog;
