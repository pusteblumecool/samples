const fs = require('fs');
const path = require('path');

function getFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (!file.startsWith('.')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getFiles('./');
let output = {};

files.forEach(f => {
  let parts = f.split(path.sep);
  if (parts.length > 1) {
    let category = parts[0];
    let filename = parts.slice(1).join('/');
    if (!output[category]) {
      output[category] = [];
    }
    output[category].push(filename);
  }
});

fs.writeFileSync('strudel.json', JSON.stringify(output, null, 2));
