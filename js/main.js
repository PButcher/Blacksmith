var testing = true,
    debug = true;

// GUI state
var gui = {

  // Annotations pane
  // 0 = 0%
  // 1 = 20%
  // 2 = 40%
  annotations: 2,

  // Code viewer line height in pixels
  codeLineHeight: 16
}

// Cursor state
var cursor = {
  yDown: 0,
  yUp: 0
}

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

// Annotator
var atr = new blacksmith.annotator(fm, pm);

$(window).resize(function() {
  resizeTabs();
});

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

    if(debug) console.log("Button: Log in");
    // Do login checks here
    // ...

    // Login ok -> Main view
    view('main');
  });

  // Populate footer
  $('footer').html('Built with io.js ' + process.version +
    ' & Electron ' + process.versions['electron']);
}

// + setupMain
// Set up main view
function setupMain() {
  setupMenu();
  setupTreeView();
  setupAnnotations();

  // Add initial pane
  pm.registerPane();
  pm.renderPane();
}

// + setupMenu
// Set up menu items
function setupMenu() {

  // Pane toggle
  $('#btn-toggle-annotations').click(function() {
    toggleAnnotations();
    console.log("Button: Toggle annotations");
    // pm.togglePane();
    // resizeTabs();
  });

  // Sign out
  $('#btn-sign-out').click(function() {

    // Do logout checks here
    // ...

    // Logout ok -> Login view
    console.log("Button: Sign out");
  });
}

// + setupTreeView
// Generates and renders tree view
function setupTreeView() {
  var tree = new blacksmith.tree();
  tree.anchor = '#tree-view';
  tree.ommit = ['.git', '.sass-cache', 'node_modules', 'vendor'];
  tree.render().setFileClickEvent(function() {
    openFile($(this).attr('data-path'));
    resizeTabs();
  });
}

// + setupAnnotations
// Set up annotations pane
function setupAnnotations() {

}

// + toggleAnnotations
// Toggle the annotations pane
function toggleAnnotations() {

  // Transition annotations from 40% to 20%
  if(gui.annotations == 2) {

    // Code -> 80%
    $('#row-code')
      .removeClass('pane-row-6')
      .addClass('pane-row-8');

    // Annotations -> 20%
    $('#row-annotations')
      .removeClass('pane-row-4')
      .addClass('pane-row-2');

    gui.annotations = 1;

  // Transition annotations from 20% to hidden
  } else if(gui.annotations == 1) {

    // Code -> 100%
    $('#row-code')
      .removeClass('pane-row-8')
      .addClass('pane-row-10');

    // Annotations -> hidden
    $('#row-annotations')
      .removeClass('pane-row-2')
      .hide();

    gui.annotations = 0;

  // Transition annotations from hidden to 40%
  } else if(gui.annotations == 0) {

    // Code -> 60%
    $('#row-code')
      .removeClass('pane-row-10')
      .addClass('pane-row-6');

    // Annotations -> 40%
    $('#row-annotations')
      .addClass('pane-row-4')
      .show();

    gui.annotations = 2;
  }
}

// + resizeTabs
// Resize pane tabs so they do not overflow
function resizeTabs() {

  // Get values for tab scaling BEFORE change
  var defaultTabWidth = 150;
  var numberOfTabs = pm.getNumberOfTabs(0);
  var paneWidth = $('.code-pane').width();
  var w = Math.floor(100 / numberOfTabs);
  var tabs = $('#code-pane-0 .code-tab');
  var tabText = $('#code-pane-0 .code-tab span');
  tabText.css("width", "auto");
  var tabsWidth;
  var tabTextWidth;

  // If the tabs won't all fit...
  if((numberOfTabs * defaultTabWidth) >= paneWidth) {
    w = w.toString() + "%";
    tabs.css("width", w);

    // Update values for tab scaling AFTER change
    tabs = $('#code-pane-0 .code-tab');
    tabText = $('#code-pane-0 .code-tab span');
    tabsWidth = tabs.outerWidth();
    tabTextWidth = tabsWidth - 55;
    tabText.css("width", tabTextWidth);
  } else {
    tabs.css("width", defaultTabWidth);
  }
}

// + openFile
// Tries to open the specified file
function openFile(filepath) {

  // Open file
  var fid = fm.open(filepath);
  var file = fm.getFile(fid);

  // If the file exists
  if(fid != undefined) {

    // Create a new tab if this file has not already been opened
    pm.registerTab(fid, file);
    pm.renderTab(fid, file);

    // Add event listeners to tab
    addTabEventListeners(fid);

    // Mark this tab as active
    tabActive(fid);

    // Let this tab be annotated
    enableTabAnnotations(fid);

    // Log opened file
    console.log("Opened: " + fm.getFilename(fid));

  // Switch to this file if it is already open
  } else {
    fm.files.forEach(function(el, i, arr) {
      if(fm.getFilepath(i) == filepath) tabActive(i);
    });
  }
}

// + closeFile
// Tries to close the specified file
function closeFile(fid) {

  // Close file
  fm.close(fid);

  // Remove tab
  pm.unregisterTab(fid)
  pm.removeTab(fid);

  // If this tab is active, switch to next active tab
  if(pm.getTabInFocus().fid == fid) {
    fm.getAllFiles().forEach(function(el, i, arr) {
      if(fm.getFile(i) != 0) tabActive(i);
    });
  }

  // If the last open file was closed
  if(pm.getNumberOfTabs() == 0) {
    clearStatusBar();
    clearTitle();
  }
}

// + addTabEventListeners
// Add event listeners to tab components
//    fid     : file id
function addTabEventListeners(fid) {

  // When the tab close icon is clicked
  $('#tab-' + fid + ' i').click(function() {
    closeFile(fid);
    resizeTabs();
  });

  // When the tab itself is clicked
  $('#tab-' + fid).click(function() {
    resizeTabs();
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
  updateTitle(fm.getFilename(fid));

  // Build string for status bar
  var statusString = fm.getFilename(fid) +
    ' - ' +
    fm.getFilepath(fid) +
    ' [' +
    fm.getFiletype(fid) +
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

// + clearStatusBar
// Clear status bar
function clearStatusBar() {
  $('#status-bar').html('');
}

// + updateTitle
// Updates window title
//    text     : text to add to title
function updateTitle(text) {
  $('title').html("Blacksmith - " + text);
}

// + clearTitle
// Clear title
function clearTitle() {
  $('title').html("Blacksmith");
}

// + enableTabAnnotations
// Let this tab be annotated
//    fid       : File ID of tab
var enableTabAnnotations = function(fid) {

  // Attach events to code viewers
  $('#code-' + fid)

    // Remove any previous events
    .unbind()

    // .mousemove(function(e) {
    //   cursor.yHover = e.pageY - $(this).offset().top;
    // })

    // Mousedown event
    .mousedown(function(e) {
      cursor.yDown = e.pageY - $(this).offset().top;
      console.log(cursor.yDown);
    })

    // Mouseup event
    .mouseup(function(e) {
      cursor.yUp = e.pageY - $(this).offset().top;
      console.log(cursor.yUp);
      selectCode(fid);
      unselectText();
    });
}

// + selectCode
// Selects lines highlighted by cursor
function selectCode(fid) {

  // Clear any existing selected lines
  clearCodeSelection();

  // Calculate the first selected line
  var first = Math.ceil(cursor.yDown / gui.codeLineHeight);

  // Calculate the last selected line
  var last = Math.ceil(cursor.yUp / gui.codeLineHeight);

  // If first is larger than last, swap the variables
  if(first > last) {
    first = [last, last = first][0];
  }

  console.log("Highlight: " + fid + " : " + first + " - " + last);

  pm.highlightLines(fid, first, last);
}

// + clearCodeSelection
// Unselects any code selection lines
function clearCodeSelection() {

}

// + unselectText
// Unselects text that was selected with mouseup
function unselectText() {
  window.getSelection().empty();
}
