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

// File manager
var fm = new blacksmith.fileManager();

// Pane manager
var pm = new blacksmith.paneManager();

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
  pm.updatePanes();
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

  // Open file
  var fid = fm.open(filepath);

  // Create a new tab if this file has not alread been opened
  if(pm.addTab(fid, fm.files[fid])) {
    addTabEventListeners(fid);
    tabActive(fid);

  // Switch to this file if it is already open
  } else {
    fm.files.forEach(function(el, i, arr) {
      if(fm.files[i].filePath == filepath) tabActive(i);
    });
  }
}

// + closeFile
// Tries to close the specified file
function closeFile(fid) {

  // Close file
  fm.close(fid);

  // Remove tab
  pm.removeTab(fid);

  // Switch to next active tab if one exists
  fm.files.forEach(function(el, i, arr) {
    if(fm.files[i] != 0) tabActive(i);
  });
}

// + addTabEventListeners
// Add event listeners to tab components
//    fid     : file id
function addTabEventListeners(fid) {

  // When the tab close icon is clicked
  $('#tab-' + fid + ' i').click(function() {
    closeFile(fid);
  });

  // When the tab itself is clicked
  $('#tab-' + fid).click(function() {
    tabActive(fid);
  });
}

// + tabSelected
// Things to do when a tab is active
//    fid       : file id
function tabActive(fid) {

  // Set active tab
  pm.setActiveTab(fid);

  // Update title bar
  updateTitle(fm.files[fid].fileName);

  // Build string for status bar
  var statusString = fm.files[fid].fileName +
    ' - ' +
    fm.files[fid].filePath +
    ' [' +
    fm.files[fid].fileType +
    ']';

  // Update status bar string
  updateStatusBar(statusString);
}

// + updateStatusBar
// Updates status bar
//    text     : text to add to status bar
function updateStatusBar(text) {
  $('#status-bar').html(text);
}

// + updateTitle
// Updates window title
//    text     : text to add to title
function updateTitle(text) {
  $('title').html("Blacksmith - " + text);
}
