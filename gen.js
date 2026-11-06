const fs = require('fs');
const path = require('path');

function getFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    // Skip hidden folders like .git and .github
    if (file.startsWith('.')) return;

    let fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

const files = getFiles('./');
let output = {};

files.forEach(f => {
  let parts = f.split(path.sep);
  // Only process if it's inside a subfolder (e.g., vox/vocal1.mp3)
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
