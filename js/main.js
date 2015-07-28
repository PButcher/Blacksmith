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
  // treeView.render().makeCollapsible();
}

// + TreeView
//    Render tree view
//    Make tree view collapsible
var TreeView = function() {
  this.anchor = "#tree-view";
  this.collapsible = true;
  this.icons = true;
};

TreeView.prototype.render = function() {
  var ommit = ['.git', '.sass-cache', 'node_modules', 'vendor'];
  var tree = blacksmith.renderTree('./', ommit);
  $(tree).appendTo($(this.anchor));
  if(this.collapsible = true) this.makeCollapsible();
  if(this.icons = true) this.addIcons();
  return this;
}

TreeView.prototype.makeCollapsible = function(speed) {
  if(!this.collapsible) this.collapsible = true;
  $('li a').click(function(e) {
    e.preventDefault();
    console.log($(this).parent());
    var nextList = $(this).parent().children('ul:first');
    if(speed == undefined) speed = 250;
    nextList.slideToggle(speed);
  });
  return this;
}

TreeView.prototype.collapseAll = function() {
  $('ul ul').hide();
}

TreeView.prototype.addIcons = function() {
  $(".bs-file").prepend('<i class="fa fa-file-o"></i>');
  $(".bs-directory").prepend('<i class="fa fa-folder-open-o"></i>');
}

TreeView.prototype.removeIcons = function() {
  $(".bs-file i, .bs-directory i").remove();
}

TreeView.prototype.remove = function() {
  $(this.anchor).html("");
  return this;
}
