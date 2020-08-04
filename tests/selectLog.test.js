const fs = require("fs");
const logFolder = "./logs";
const selectLog = require("../functions/selectLog.js").selectLog;

test("folder is empty", () => {
  if (fs.existsSync(logFolder) && fs.readdirSync(logFolder).length > 0) {
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
});
test("folder doesn't exist", () => {
  fs.rmdirSync(logFolder);

  expect(selectLog()).toBe(null);
});
test("selecting a file", () => {
  fs.mkdirSync(logFolder);
  var data = `{
    "test": "file"
     }`;
  var fileName = logFolder + "/testfile" + (i + 1) + ".json";
  for (i = 0; i < 5; i++) {
    fs.writeFileSync(fileName, data);
  }

  expect(selectLog(3)).toBeDefined();
});
