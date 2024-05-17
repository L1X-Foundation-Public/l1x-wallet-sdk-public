const packageJson = require("../package.json");
const packageCJSJson = require("./package.cjs.json");
const packageESMJson = require("./package.esm.json");

const fs = require("fs").promises;

(async () => {


  delete packageJson.source;
  delete packageJson.type;
  
  packageJson.types =  "cjs/index.d.ts",
  packageJson.main =  "cjs/index.js", 
  packageJson.module =  "esm/index.js", 
  packageJson.exports = {
    ".": {
      "import": "./esm/index.js",
      "require": "./cjs/index.js"
    }
  };
  packageJson.scripts = {};
  packageJson.files = [
    "esm",
    "cjs",
    "README.md",
    "package.json"
  ];


  // Copy README file
  try {
    await fs.copyFile("./README.md", "./dist/README.md");
    console.log("README copied successfully!");
  } catch (err) {
    console.error("Error copying the README:", err);
  }
  
  

  try {
    // Write Package.json
    const fd = await fs.open("./dist/package.json", "w+");
    await fs.writeFile(fd, JSON.stringify(packageJson, null, 2));
    console.log("package.json created succesfully");
  } catch (err) {
    console.error("Error writing to package.json:", err);
  }

  try {
    // Write Package.json
    const fd = await fs.open("./dist/cjs/package.json", "w+");
    await fs.writeFile(fd, JSON.stringify(packageCJSJson, null, 2));
    console.log("package.json created succesfully");
  } catch (err) {
    console.error("Error writing to package.cjs.json:", err);
  }

  try {
    // Write Package.json
    const fd = await fs.open("./dist/esm/package.json", "w+");
    await fs.writeFile(fd, JSON.stringify(packageESMJson, null, 2));
    console.log("package.json created succesfully");
  } catch (err) {
    console.error("Error writing to package.esm.json:", err);
  }
})();
