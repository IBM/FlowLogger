const colors = require("colors");
const logFolder = "./logs";
const fs = require("fs");
const clearLogs = require("../functions/clearLogs.js").clearLogs;
test("clear log empty folder", () => {
  if (fs.existsSync(logFolder) && fs.readdirSync(logFolder).length > 0) {
    //deleting folder
    fs.readdirSync(logFolder).forEach(file => {
      try {
        fs.unlinkSync(logFolder + "/" + file);
      } catch (error) {
        problem = true;
      }
    });
  } else if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
  }
  expect(clearLogs()).toBe("Folder is already empty\n".yellow);
});
test("clear log folder doesn't exist", () => {
  fs.rmdirSync(logFolder);

  expect(clearLogs()).toBe("Error, folder does not exist\n".red);
});
