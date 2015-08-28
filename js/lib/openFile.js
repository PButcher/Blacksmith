var fs = require('fs');

// List of known file types
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

// + File
//    filepath      : filepathe of file to read
//    html          : does file contain html?
function File(filepath, html) {

  // If html argument has not been set, set to true
  if(html === undefined) html = true;

  // File properties
  this.filePath = filepath;
  this.fileName = this.getName();
  this.fileType = this.getType();
  this.fileExtension = this.getExtension();
  this.fileContents = '';
  this.fileContentsArray;

  // Read file
  // this.read(this.filePath, function(err, data) {
  //   if(html) this.fileContents = replaceAll(data, ['<', '>'], ['&lt;', '&gt;']);
  //   this.fileContentsArray = data.split('\n');
  // }.bind(this));
  this.readSync(this.filePath, html);
}

// + read
// Read contents of file (async)
//    filePath      : filepath of file to read
//    callback      : callback function
File.prototype.read = function(filePath, callback) {
  fs.readFile(filePath, 'utf8', function(err, data){
    if(err) throw callback(err);
    callback(null, data);
  });
}

// + readSync
// Read contents of file
//    filePath      : filepath of file to read
//    html          : does the file contain html?
File.prototype.readSync = function(filepath, html) {
  var data = fs.readFileSync(filepath, 'utf8');
  if(html) this.fileContents = replaceAll(data, ['<', '>'], ['&lt;', '&gt;']);
  this.fileContentsArray = data.split('\n');
}

// + getName
// Returns filename of this file
File.prototype.getName = function() {
  return this.filePath.replace(/^.*[\\\/]/, '');
}

// + getType
// Returns filetype of this file
File.prototype.getType = function() {
  var fx = this.getExtension(this.fileName),
      ft = fileTypes[fx];
  return (ft != undefined) ? ft : 'markup';
}

// + getExtension
// Returns file extension of this file
File.prototype.getExtension = function() {
  var fn = this.fileName.split('.');
  if(fn.length === 1 || (fn[0] === '' && fn.length === 2)) return '';
  return fn.pop();
}

// - replaceAll
// Replace all occurrences of multiple items
//    data        : data to perform replacement on
//    find        : array of items to replace
//    replace     : array of replacements
function replaceAll(data, find, replace) {
  for(var i = 0; i < find.length; i++) {
    data = data.replace(new RegExp(escapeRegExp(find[i]), 'g'), replace[i]);
  }
  return data;
}

// - escapeRegExp
// Escape meta characters
//    str         : string to escape
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// exports
exports.File = File;
