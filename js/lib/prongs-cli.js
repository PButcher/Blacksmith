#! /usr/bin/env node

var util = require('util'),
    fs = require('fs'),
    prongs = require('./prongs'),
    program = require('commander');

program
  .version('0.0.1')
  .usage('<filepath> [output filename] [options...]')
  .description('Represent directory structures as JSON')
  .option('-s, --stringify', 'stringify object')
  .parse(process.argv);

var tree = prongs.getTree(program.args[0])
var out = program.args[1];
var res = util.inspect(tree, false, null);

if(program.stringify) res = JSON.stringify(tree);

if (out == undefined) out = "prongs-out.json";

fs.writeFile(out, res, function(err) {
  if(err) return console.log(err);
});
