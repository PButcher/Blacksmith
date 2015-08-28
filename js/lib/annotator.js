var fs = require('fs');

function Annotator(fm, pm) {

  this.fm = fm;
  this.pm = pm;

  // Private md templates
  this.privTemplates = [];

  // Public md templates
  this.pubTemplates = [];
}

// + addPrivTemplate
// Add private template to privTemplates array
//    template    : template to add to private template array
Annotator.prototype.addPrivTemplate = function(template) {
  this.privTemplates.push(template);
}

// + addPubTemplate
// Add public template to pubTemplates array
//    template    : template to add to public template array
Annotator.prototype.addPubTemplate = function(template) {
  this.pubTemplates.push(template);
}

Annotator.prototype.getPaneManager = function() {
  return this.pm;
}

// Next job here:
// - Start adding markdown files to annotator arrays
// - Either alter/split filemanager to modularise the file loading process or allow fileManager to be more versatile, less opinionated
// - Add parsing functions ie getTitle, getType, (getNextTitle)

// exports
exports.Annotator = Annotator;
