// Load JQuery
window.$ = window.jQuery = require('./vendor/jquery/dist/jquery.min.js');

// jQuery magic happens here
$("document").ready(function() {

  // Populate footer
  $("footer").html("Built using io.js " + process.version +
    " & Electron " + process.versions['electron']);
});
