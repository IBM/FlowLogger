const colors = require("colors");
const clearLogs = require("../functions/clearLogs.js").clearLogs;
test("clear log folder doesn't exist", async () => {
  expect(clearLogs()).toBe("Folder is already empty\n".yellow);
});
test("clear log empty folder", async () => {
  expect(clearLogs()).toBe("Folder is already empty\n".yellow);
});
