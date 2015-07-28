var prongs = require('./lib/prongs.js');

// + renderTree
// Helper for buildTree function.
// Sets initial directory fromt which to build tree
//    dir          : the directory to convert to a tree
//    omissions    : list of directories or files to ommit
function renderTree(dir, omissions) {
  var tree = prongs.getTree(dir).children;
  return buildTree(tree, omissions);
}

// - buildTree
// Recurse over tree object to build markup for directory structure
//    tree         : directory structure object
//    omissions    : list of directories or files to ommit
function buildTree(tree, omissions) {
  var markup = "<ul>";
  for(el in tree) {
    if(tree[el]) {
      if(omissions.indexOf(tree[el].name) < 0) {
        markup += '<li data-path="' + tree[el].path + '" class="bs-' + tree[el].type + '"><a href="#">' + tree[el].name + '</a>';
        if(tree[el].children) {
          markup += buildTree(tree[el].children, omissions);
        }
        markup += '</li>';
      }
    }
  }
  return markup += "</ul>";
}

// exports
exports.renderTree = renderTree;
