// prongs.js
var fs = require('fs');
var path = require('path');

// getTree
function getTree(filepath) {

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

if (module.parent == undefined) {
  var util = require('util');
  console.log(util.inspect(getTree(process.argv[2]), false, null));
}

// exports
exports.getTree = getTree;
