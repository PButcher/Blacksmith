// prongs.js
var fs = require('fs');
var path = require('path');

// getTree
function getTree(filepath) {

  filepath = path.normalize(filepath);

  var stats = fs.lstatSync(filepath);
  var info = {
    path: filepath,
    name: path.basename(filepath)
  };

  if (stats.isDirectory()) {
    info.type = "directory";
    info.children = fs.readdirSync(filepath).map(function(child) {
      return getTree(path.join(filepath, child));
    });
  } else {
    info.type = "file";
  }
  return info;
}

// exports
exports.getTree = getTree;
