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

PaneManager.prototype.getPaneInFocus = function() {
  return this.paneInFocus;
}

PaneManager.prototype.setPaneInFocus = function(pid) {
  this.paneInFocus = pid;
}

PaneManager.prototype.getTabInFocus = function() {
  return this.tabInFocus;
}

PaneManager.prototype.setTabInFocus = function(fid) {
  this.tabInFocus = fid;
}

PaneManager.prototype.getNumberOfPanes = function() {
  return this.panes.length;
}

PaneManager.prototype.getNumberOfTabs = function(pid) {
  if(pid === undefined) pid = this.paneInFocus;
  return this.panes[pid].tabs.length;
}

PaneManager.prototype.registerPane = function() {
  this.panes.push({'tabs':[]});
}

PaneManager.prototype.unregisterPane = function(pid) {
  if(pid === undefined) pid = this.paneInFocus;
  this.panes.splice(pid, 1);
}

PaneManager.prototype.registerTab = function(fid, file, pid) {
  if(pid === undefined) pid = this.paneInFocus;
  this.panes[pid].tabs.push({
    'fid':fid,
    'filename':file.fileName
  });
}

PaneManager.prototype.unregisterTab = function(fid) {
  for(var i = 0; i < this.panes.length; i++) {
    for(var j = 0; j < this.panes[i].tabs.length; j++) {
      if(this.panes[i].tabs[j].fid == fid) {
        this.panes[i].tabs.splice(j, 1);
      }
    }
  }
}

PaneManager.prototype.removePane = function(pid) {
  if(pid === undefined) pid = this.paneInFocus;
  $('#code-pane-' + pid).remove();
}

PaneManager.prototype.removeTab = function(fid) {
  $('#tab-' + fid).remove();
  $('#body-' + fid).remove();
}

PaneManager.prototype.renderPane = function(pid) {
  if(pid === undefined) pid = this.paneInFocus;
  var paneTemplate = '<div class="pane pane-column-10 code-pane" id="code-pane-' + pid + '">' +
    '<nav class="code-tabs">' +
    '</nav>' +
    '<div class="code-bodies">' +
    '</div>' +
  '</div>';
  $('#code').append(paneTemplate);
}

PaneManager.prototype.renderTab = function(fid, file, pid) {
  if(pid === undefined) pid = this.paneInFocus;

  // New tab template
  var newTab = '<a href="#" class="code-tab tab-active" data-tab="' + fid +
  '" id="tab-' + fid + '"><span>' + file.fileName + '</span><i class="fa fa-close"></i>';

  // Add tab to pane
  $('#code-pane-' + pid + ' .code-tabs').append(newTab);

  // Inject file contents into tab once contents have been read
  watch(file, "fileContents", function a(prop, action, newvalue, oldvalue) {

    var newBody = '<div class="code-body" data-body="' + fid +
    '" id="body-' + fid +
    '"><pre class="line-numbers"><code class="language-' + file.fileType +
    '">' + newvalue + '</code></pre>';

      $('#code-pane-' + pid + ' .code-bodies').append(newBody);

      Prism.highlightAll();

  }.bind(this));
}

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

PaneManager.prototype.moveTab = function() {
  // this.panes[this.paneInFocus].tabs
}

PaneManager.prototype.setActivePane = function() {
  for(var i = 0; i < this.panes.length; i++) {
    for (var j = 0; j < this.panes[i].tabs.length; j++) {
      if(this.panes[i].tabs[j].fid == this.tabInFocus) {
        this.setPaneInFocus(i);
      }
    }
  }
}

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

// exports
exports.PaneManager = PaneManager;
