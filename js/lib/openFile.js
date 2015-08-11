var fs = require('fs');

var fileTypes = {
  'html': 'markup',
  'xml': 'markup',
  'c': 'c',
  'cs': 'csharp',
  'cpp': 'cpp',
  'o': 'c',
  'h': 'c',
  'css': 'css',
  'map': 'javascript',
  'js': 'javascript',
  'json': 'javascript',
  'asp': 'asp',
  'aspx': 'asp',
  'git': 'git',
  'groovy': 'groovy',
  'java': 'java',
  'jsp': 'java',
  'less': 'less',
  'makefile': 'makefile',
  'md': 'markdown',
  'pl': 'perl',
  'php': 'php',
  'py': 'python',
  'rb': 'ruby',
  'scss': 'scss',
  'yaml': 'yaml'
};

function File(filepath) {
  this.filePath = filepath;
  this.fileName = this.getName();
  this.fileType = this.getType();
  this.fileExtension = this.getExtension();
  this.fileContents = '';
  this.fileContentsArray;
  this.read(this.filePath, function(err, data) {
    this.fileContents = data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    this.fileContentsArray = data.split('\n');
  }.bind(this));
}

File.prototype.read = function(filePath, callback) {
  fs.readFile(filePath, 'utf8', function(err, data){
    if(err) throw callback(err);
    callback(null, data);
  });
}

File.prototype.getName = function() {
  return this.filePath.replace(/^.*[\\\/]/, '');
}

File.prototype.getType = function() {
  var fx = this.getExtension(this.fileName);
  var ft = fileTypes[fx];
  return (ft != undefined) ? ft : 'markup';
}

File.prototype.getExtension = function() {
  var fn = this.fileName.split('.');
  if(fn.length === 1 || (fn[0] === '' && fn.length === 2)) return '';
  return fn.pop();
}

// exports
exports.File = File;
