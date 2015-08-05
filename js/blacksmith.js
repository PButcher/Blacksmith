// Load TreeView
var tree = require('./lib/treeView');
var openFile = require('./lib/openFile');
var fileManager = require('./lib/fileManager');
var paneManager = require('./lib/paneManager');

// exports
exports.tree = tree.TreeView;
exports.file = openFile.File;
exports.fileManager = fileManager.FileManager;
exports.paneManager = paneManager.PaneManager;
