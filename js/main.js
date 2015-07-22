// Load JQuery
window.$ = window.jQuery = require('./vendor/jquery/dist/jquery.min.js');

// Load Blacksmith
var blacksmith = require("./js/blacksmith.js");

// jQuery magic happens here
$("document").ready(function() {

  // Populate footer
  $("footer").html("Built with io.js " + process.version +
    " & Electron " + process.versions['electron']);
});
