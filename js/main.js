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

// Array of open files
var openFiles = [];

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
    view('main');
  });

  // Populate footer
  $('footer').html('Built with io.js ' + process.version +
    ' & Electron ' + process.versions['electron']);
}

// + setupMain
// Set up main view
function setupMain() {
  setupTreeView();
  setupTreeViewListeners();
}

// + setupTreeView
// Generates and renders tree view
function setupTreeView() {
  var tree = new blacksmith.tree();
  tree.anchor = '#tree-view';
  tree.ommit = ['.git', '.sass-cache', 'node_modules', 'vendor'];
  tree.render();
}

// + setupTreeViewListeners
// Any interaction events with the tree-view
function setupTreeViewListeners() {

  // When a file in treeView is clicked
  $('.bs-file').click(function() {
    openFile($(this).attr('data-path'));
  });
}

// + openFile
// Tries to open the specified file
function openFile(filepath) {

  var fileAlreadyOpen = false;

  if(openFiles.length != 0) {
    for(var i = 0; i < openFiles.length; i++) {
      if(openFiles[i].filePath == filepath) {
        fileAlreadyOpen = true;
        break;
      }
    }
  }
  if(fileAlreadyOpen == false) {
    openFiles.push(new blacksmith.file(filepath));
  }
}
