const fs = require('fs');
const path = require('path');

// Funktion zum rekursiven Durchsuchen aller Ordner
function getFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (file.startsWith('.')) return; // Versteckte Ordner überspringen

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
let output = {
  "_base": "https://raw.githubusercontent.com/pusteblumecool/samples/main/"
};

let categories = {};

files.forEach(f => {
  let parts = f.split(path.sep);
  if (parts.length > 1) {
    let category = parts[0];
    // Relativen Pfad für Strudel bauen (z.B. "vox/vocal1.mp3")
    let relativePath = parts.join('/');
    
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push(relativePath);
  }
});

// Wenn ein Ordner mehrere Dateien hat, als Array speichern, ansonsten als Einzelstring
Object.keys(categories).forEach(cat => {
  if (categories[cat].length === 1) {
    output[cat] = categories[cat][0];
  } else {
    output[cat] = categories[cat];
  }
});

fs.writeFileSync('strudel.json', JSON.stringify(output, null, 2));
console.log('strudel.json successfully generated in Dave-style!');
