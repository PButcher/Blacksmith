// + fileManager
// Manages the displaying of files
function FileManager() {
  this.files = [];
}

FileManager.prototype.open = function(filepath) {

  var fileAlreadyOpen = false;
  var indexOfNew  = 0;

  if(this.files.length != 0) {
    for(var i = 0; i < this.files.length; i++) {
      if(this.files[i].filePath == filepath) {
        fileAlreadyOpen = true;
        break;
      }
      indexOfNew++;
    }
  }
  if(fileAlreadyOpen == false) {
    this.files.push(new blacksmith.file(filepath));
    return indexOfNew;
  }
}

FileManager.prototype.close = function(fid) {
  this.files[fid] = 0;
  return fid;
}

// exports
exports.FileManager = FileManager;
