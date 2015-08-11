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

PaneManager.prototype.addTab = function(fid, file) {
  if(typeof(fid) == 'number') {
    if(this.panes[0] === undefined) {
      this.paneInFocus = 0;
      this.panes.push({'tabs':[]});
    }
    this.panes[this.paneInFocus].tabs.push({
      'fid':fid,
      'filepath':file.filePath
    });
    this.drawTab(fid, file);
    return 1;
  } else {
    return 0;
  }
}

PaneManager.prototype.removeTab = function(fid) {
  var pid = this.paneInFocus;
  for(var i = 0; i < this.panes[pid].tabs.length; i++) {
    if(this.panes[pid].tabs[i].fid == fid) {
      this.panes[pid].tabs.splice(i, 1);
    }
  }
  $('#tab-' + fid).remove();
  $('#body-' + fid).remove();
}

PaneManager.prototype.updatePanes = function() {
  if(this.panes.length == 0) {
    this.addPane(0);
  } else if (this.panes.length == 1) {
    $('#code-pane-1').remove();
    $('#code-pane-0').removeClass('pane-column-5').addClass('pane-column-10');
  } else if (this.panes.length == 2) {
    $('#code-pane-0').removeClass('pane-column-10').addClass('pane-column-5');
    this.addPane(1);
    $('#code-pane-1').removeClass('pane-column-10').addClass('pane-column-5');
  }
}

PaneManager.prototype.addPane = function(p) {
    var templatePane = '<div class="pane pane-column-10 code-pane" id="code-pane-' + p + '">' +
      '<nav class="code-tabs">' +
      '</nav>' +
      '<div class="code-bodies">' +
      '</div>' +
    '</div>';
    $('#code').append(templatePane);
}

PaneManager.prototype.drawTab = function(fid, file) {

  // Set active tab
  this.setActiveTab(fid);

  // New tab template
  var newTab = '<a href="#" class="code-tab tab-active" data-tab="' + fid +
  '" id="tab-' + fid + '"><span>' + file.fileName + '</span><i class="fa fa-close"></i>';

  // Add tab to pane
  $('#code-pane-' + this.paneInFocus + ' .code-tabs').append(newTab);

  // Inject file contents into tab once contents have been read
  watch(file, "fileContents", function a(prop, action, newvalue, oldvalue) {

    var newBody = '<div class="code-body" data-body="' + fid +
    '" id="body-' + fid +
    '"><pre class="line-numbers"><code class="language-' + file.fileType +
    '">' + newvalue + '</code></pre>';

      $('#code-pane-' + this.paneInFocus + ' .code-bodies').append(newBody);

      Prism.highlightAll();

  }.bind(this));
}

// + setActiveTab
// Sets the active tab
//    fid     : file id
PaneManager.prototype.setActiveTab = function(fid) {

  // Remove active class from all tabs
  $('.tab-active').removeClass('tab-active');

  // Hide all code bodies
  $('.code-body').hide();

  // Set focussed tab
  this.tabInFocus = this.panes[this.paneInFocus].tabs[fid];

  // Add highlight to active tab
  $('#tab-' + fid).addClass('tab-active');

  // Show active body
  $('#body-' + fid).show();
}

// exports
exports.PaneManager = PaneManager;
