const fs = require("fs");
const { join, resolve } = require("path");

const lib = resolve(__dirname, "../");
const cp = require("child_process");

fs.readdirSync(lib).forEach(function (mod) {
  const modPath = join(lib, mod);

  // ensure path has package.json
  if (!fs.existsSync(join(modPath, "package.json"))) return;

  cp.spawn("npm", ["i"], {
    env: process.env,
    cwd: modPath,
    stdio: "inherit",
  });
});
