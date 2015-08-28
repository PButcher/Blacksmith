var WatchJS = require('watchjs');
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var callWatchers = WatchJS.callWatchers;

// + PaneManager
// Manage panes and tabs
function PaneManager() {
  this.panes = [];
  this.paneInFocus = 0;
  this.tabInFocus = 0;
}

// + getPaneInFocus
// Returns the pane ID of the focussed pane
PaneManager.prototype.getPaneInFocus = function() {
  return this.paneInFocus;
}

// + setPaneInFocus
// Updates the pane ID of the focussed pane
//    pid       : pane ID
PaneManager.prototype.setPaneInFocus = function(pid) {
  this.paneInFocus = pid;
}

// + getTabInFocus
// Returns the tab ID of the focussed tab
PaneManager.prototype.getTabInFocus = function() {
  return this.tabInFocus;
}

// + setTabInFocus
// Updates the tab ID of the focussed tab
//    fid       : file ID
PaneManager.prototype.setTabInFocus = function(fid) {
  this.tabInFocus = fid;
}

// + getNumberOfPanes
// Returns the number of active panes
PaneManager.prototype.getNumberOfPanes = function() {
  return this.panes.length;
}

// + getNumberOfTabs
// Returns the number of active tabs
PaneManager.prototype.getNumberOfTabs = function(pid) {
  if(pid === undefined) pid = this.paneInFocus;
  return this.panes[pid].tabs.length;
}

// + registerPane
// Registers a pane in the panes array ready to be populated
PaneManager.prototype.registerPane = function() {
  this.panes.push({'tabs':[]});
}

// + unregisterPane
// Removes a pane from the panes array
//    pid       : pane ID of pane to be removed
PaneManager.prototype.unregisterPane = function(pid) {
  if(pid === undefined) pid = this.paneInFocus;
  this.panes.splice(pid, 1);
}

// +registerTab
// Register a new tab in the panes array
//    fid       : file ID associtated with this tab
//    file      : file associated with this tab
//    pid       : pane ID of pane this tab is a member of
PaneManager.prototype.registerTab = function(fid, file, pid) {
  if(pid === undefined) pid = this.paneInFocus;
  this.panes[pid].tabs.push({
    'fid':fid,
    'filename':file.fileName
  });
}

// + unregisterTab
// Removes a tab from the active pane
//    fid       : file ID of the tab to remove
PaneManager.prototype.unregisterTab = function(fid) {
  for(var i = 0; i < this.panes.length; i++) {
    for(var j = 0; j < this.panes[i].tabs.length; j++) {
      if(this.panes[i].tabs[j].fid == fid) {
        this.panes[i].tabs.splice(j, 1);
      }
    }
  }
}

// + removePane
// Removes specified pane from list of active panes
//    pid       : pane ID of pane to be removed
PaneManager.prototype.removePane = function(pid) {
  if(pid === undefined) pid = this.paneInFocus;
  $('#code-pane-' + pid).remove();
}

// + removeTab
// Removes specified tab fro m DOM
//    fid       : file ID of tab to be removed
PaneManager.prototype.removeTab = function(fid) {
  $('#tab-' + fid).remove();
  $('#body-' + fid).remove();
}

// + renderPane
// Renders pane in DOM
//    pid       : pane ID of pane to render
PaneManager.prototype.renderPane = function(pid) {
  if(pid === undefined) pid = this.paneInFocus;

  // New pane template
  var paneTemplate = '<div class="pane pane-column-10 code-pane" id="code-pane-' + pid + '">' + '<nav class="code-tabs">' + '</nav>' + '<div class="code-bodies">' + '</div>' + '</div>';

  // Inject new pane into DOM
  $('#code').append(paneTemplate);
}

// + renderTab
// Renders tab in DOM
//    fid       : file ID of file to render
//    file      : file to associate with this tab
//    pid       : pane ID of pane to render
PaneManager.prototype.renderTab = function(fid, file, pid) {
  if(pid === undefined) pid = this.paneInFocus;

  // New tab template
  var newTab = '<a href="#" class="code-tab tab-active" data-tab="' + fid + '" id="tab-' + fid + '"><span>' + file.fileName + '</span><i class="fa fa-close"></i>';

  // Add tab to pane
  $('#code-pane-' + pid + ' .code-tabs').append(newTab);

  // Inject file contents into tab once contents have been read
  // watch(file, "fileContents", function a(prop, action, newvalue, oldvalue) {

    // New code body template
    var newBody = '<div class="code-body" data-body="' + fid + '" id="body-' + fid + '"><pre class="line-numbers"><code id="code-' + fid + '" class="language-' + file.fileType + '">' + file.fileContents + '</code></pre>';

    // Inject new code body into DOM
    $('#code-pane-' + pid + ' .code-bodies').append(newBody);

    Prism.highlightAll();

  // }.bind(this));
}

// + togglePane
// Toggle between 1 and 2 panes
PaneManager.prototype.togglePane = function() {
  if(this.getNumberOfPanes() == 1) {
    this.registerPane();
    this.renderPane(1);
    $('#code-pane-0').removeClass('pane-column-10').addClass('pane-column-5');
    $('#code-pane-1').removeClass('pane-column-10').addClass('pane-column-5');
  } else if (this.getNumberOfPanes() == 2) {
    this.unregisterPane(1);
    this.removePane(1);
    $('#code-pane-0').removeClass('pane-column-5').addClass('pane-column-10');
  }
}

// + setActivePane
// Set active pane to pane in focus
PaneManager.prototype.setActivePane = function() {
  for(var i = 0; i < this.panes.length; i++) {
    for (var j = 0; j < this.panes[i].tabs.length; j++) {
      if(this.panes[i].tabs[j].fid == this.tabInFocus) {
        this.setPaneInFocus(i);
      }
    }
  }
}

// + setActiveTab
// Set active tab to specified file and specified pane
//    fid       : file ID of tab to make active
//    pid       : pane ID of pane contain specified tab
PaneManager.prototype.setActiveTab = function(fid, pid) {
  if(pid === undefined) pid = this.paneInFocus;

  // Remove active class from all tabs
  $('.tab-active').removeClass('tab-active');

  // Hide all code bodies
  $('.code-body').hide();

  // Set focussed tab
  this.panes[pid].tabs.forEach(function(el, i, arr) {
    if (el.fid == fid) {
      this.tabInFocus = this.panes[pid].tabs[i];
    }
  }.bind(this));

  // Add highlight to active tab
  $('#tab-' + fid).addClass('tab-active');

  // Show active body
  $('#body-' + fid).show();

  this.setActivePane();
}

// + highlightLine
// Highlight a line of a code block
//    fid       : file ID of tab to highlight
//    line      : line number to highlight
PaneManager.prototype.highlightLine = function(fid, line) {
  $('#body-' + fid + ' pre').attr('data-line', line-1);
  Prism.highlightAll();
}

// + highlightLines
// Highlight lines of a code block
//    fid       : file ID of tab to highlight
//    first     : first line of range to highlight
//    last      : last line of range to highlight
PaneManager.prototype.highlightLines = function(fid, first, last) {
  $('#body-' + fid + ' pre').attr('data-line', (first-1) + '-' + (last-1));
  Prism.highlightAll();
}

// exports
exports.PaneManager = PaneManager;
