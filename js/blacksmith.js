var prongs = require('./lib/prongs.js');
var dir = prongs.getTree('./').children;

document.write(buildTree(dir));

//buildTree (WIP)
// - Add omissions
// - Add properties as attributes
function buildTree(tree) {
  var markup = "<ul>";
    for(el in tree) {
      if(tree[el]) {
        markup += "<li data-path=" + tree[el].path + ">" + tree[el].name + " : " + tree[el].type + "</li>";
        if(tree[el].children) {
          markup += buildTree(tree[el].children);
        }
      }
    }
    return markup += "</ul>";
}
