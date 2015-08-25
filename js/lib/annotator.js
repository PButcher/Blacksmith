var fs = require('fs');

function Annotator() {

  // Private md templates
  this.privTemplates = [];

  // Public md templates
  this.pubTemplates = [];
}

// + addPrivTemplate
// Add private template to privTemplates array
Annotator.prototype.addPrivTemplate = function(template) {
  this.privTemplates.push(template);
}

// + addPubTemplate
// Add public template to pubTemplates array
Annotator.prototype.addPubTemplate = function(template) {
  this.pubTemplates.push(template);
}

// Next job here:
// - Start adding markdown files to annotator arrays
// - Either alter/split filemanager to modularise the file loading process or allow fileManager to be more versatile, less opinionated
// - Add parsing functions ie getTitle, getType, (getNextTitle)

// exports
exports.Annotator = Annotator;
