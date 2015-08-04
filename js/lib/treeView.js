var prongs = require('./prongs.js');

// + TreeView
//    Render tree view
//    Make tree view collapsible
function TreeView() {
  this.anchor = '';
  this.collapsible = true;
  this.initiallyCollapsed = true;
  this.icons = {};
  this.icons.dirOpen = 'fa fa-folder-open';
  this.icons.dirClosed = 'fa fa-folder';
  this.icons.file = 'fa fa-file';
  this.icons.active = true;
  this.ommit = [];
};

TreeView.prototype.render = function() {
  var tree = seed('./', this.ommit);
  $(tree).appendTo($(this.anchor));
  if(this.icons.active) this.addIcons();
  if(this.collapsible) this.makeCollapsible();
  if(this.collapsible && this.initiallyCollapsed) this.collapseAll();
  return this;
}

TreeView.prototype.makeCollapsible = function(speed) {
  var that = this;
  if(!this.collapsible) this.collapsible = true;
  $('li a').click(function(e) {
    e.preventDefault();
    var next = $(this).parent().children('ul:first');
    if(speed == undefined) speed = 250;
    next.slideToggle(speed);
    next.parent().children('a').children('i').toggleClass(that.icons.dirClosed);
    next.parent().children('a').children('i').toggleClass(that.icons.dirOpen);
  });
  return this;
}

TreeView.prototype.collapseAll = function() {
  $('ul ul').hide();
  $(this.anchor + ' i').removeClass(this.icons.dirOpen);
  $(this.anchor + ' i').addClass(this.icons.dirClosed);
}

TreeView.prototype.addIcons = function() {
  $(".bs-file > a").prepend('<i class="' + this.icons.file + '"></i>');
  $(".bs-directory > a").prepend('<i class="' + this.icons.dirOpen + '"></i>');
}

TreeView.prototype.removeIcons = function() {
  $(".bs-file i, .bs-directory i").remove();
}

TreeView.prototype.remove = function() {
  $(this.anchor).html("");
  return this;
}

// - growTree
// Recurse over tree object to build markup for directory structure
//    tree         : directory structure object
//    omissions    : list of directories or files to ommit
function growTree(tree, omissions) {
  var markup = "<ul>";
  for(el in tree) {
    if(tree[el]) {
      if(omissions.indexOf(tree[el].name) < 0) {
        markup += '<li data-path="' + tree[el].path + '" class="bs-' + tree[el].type + '"><a href="#"><span>' + tree[el].name + '</span></a>';
        if(tree[el].children) {
          markup += growTree(tree[el].children, omissions);
        }
        markup += '</li>';
      }
    }
  }
  return markup += "</ul>";
}

// - seed
// Helper for buildTree function.
// Sets initial directory from which to build tree
//    dir          : the directory to convert to a tree
//    omissions    : list of directories or files to ommit
function seed(dir, omissions) {
  var tree = prongs.getTree(dir).children;
  return growTree(tree, omissions);
}

// exports
exports.TreeView = TreeView;
