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

// + render
// Render tree in DOM
TreeView.prototype.render = function() {
  var tree = seed('./', this.ommit);
  $(tree).appendTo($(this.anchor));
  if(this.icons.active) this.addIcons();
  if(this.collapsible) this.makeCollapsible(0);
  if(this.collapsible && this.initiallyCollapsed) this.collapseAll();
  return this;
}

// + makeCollapsible
// Allow the treeview to collapse
//    speed      : collapse animation speed
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

// + collapseAll
// Collapse all directories
TreeView.prototype.collapseAll = function() {
  $('ul ul').hide();
  $(this.anchor + ' i').removeClass(this.icons.dirOpen);
  $(this.anchor + ' i').addClass(this.icons.dirClosed);
}

// + addIcons
// Add icons to files and directories
TreeView.prototype.addIcons = function() {
  $(".bs-file > a").prepend('<i class="' + this.icons.file + '"></i>');
  $(".bs-directory > a").prepend('<i class="' + this.icons.dirOpen + '"></i>');
}

// + removeIcons
// Remove ivons from files and directories
TreeView.prototype.removeIcons = function() {
  $(".bs-file i, .bs-directory i").remove();
}

// + remove
// Remove tree view from DOM
TreeView.prototype.remove = function() {
  $(this.anchor).html("");
  return this;
}

// + setFileClickEvent
// Attach click event listener to file
//    clickEventFunc  : function to attach
TreeView.prototype.setFileClickEvent = function(clickEventFunc) {
  return $('.bs-file').click(clickEventFunc);
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
