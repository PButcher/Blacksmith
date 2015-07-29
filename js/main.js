// Testing?
var testing = true;

// Load JQuery
window.$ = window.jQuery = require('./vendor/jquery/dist/jquery.min.js');

// Load Blacksmith
var blacksmith = require('./js/blacksmith.js');

// Blacksmith views
var views = [
  'entry',
  'main'
  ];

// jQuery magic happens here
$('document').ready(function() {

  // Set program entry point
  if(testing) {
    view('main');
  } else {
    view('entry');
  }

  // Set up views
  setupEntry();
  setupMain();
});

// + view
// View transitioner
//    view    : View to transition to
function view(view) {
  views.forEach(function(el, i, arr) {
    $('#view-' + el).hide();
  });
  $('#view-' + view).show();
}

// + setupEntry
// Set up entry view
function setupEntry() {

  // Sign in
  $('#sign-in').click(function() {

    // Do login
    view("main");
  });

  // Populate footer
  $('footer').html('Built with io.js ' + process.version +
    ' & Electron ' + process.versions['electron']);
}

// + setupMain
// Set up main view
function setupMain() {

  var treeView = new TreeView();
  treeView.render();
}

// + TreeView
//    Render tree view
//    Make tree view collapsible
function TreeView() {
  this.anchor = '#tree-view';
  this.collapsible = true;
  this.initiallyCollapsed = true;
  this.icons = {};
  this.icons.dirOpen = 'fa-folder-open';
  this.icons.dirClosed = 'fa-folder';
  this.icons.file = 'fa-file';
  this.icons.active = true;
};

TreeView.prototype.render = function() {
  var ommit = ['.git', '.sass-cache', 'node_modules', 'vendor'];
  var tree = blacksmith.renderTree('./', ommit);
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
  $(".bs-file > a").prepend('<i class="fa ' + this.icons.file + '"></i>');
  $(".bs-directory > a").prepend('<i class="fa ' + this.icons.dirOpen + '"></i>');
}

TreeView.prototype.removeIcons = function() {
  $(".bs-file i, .bs-directory i").remove();
}

TreeView.prototype.remove = function() {
  $(this.anchor).html("");
  return this;
}
