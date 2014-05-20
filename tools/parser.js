var jade = require('jade');
var fs = require('fs');
var path = require('path');

var root = '../tpls';
var entrance = '../tpls/index.jade';
var output   = '../index.html';

fs.readdir(root,function( err, files ) {
  files.forEach(function( source ) {
    if( path.extname( source ) == '.jade'){
      fs.watch( root + '/' + source,function( e ) {
        if( e == 'change' ){
          console.log( e );
          console.log( source, 'changed' );
          console.time('compile');
          jade.renderFile(entrance,{},function( err, html ) {
            console.timeEnd('compile');
            console.log( Date.now(), ' compile finish err : ', err);
            fs.writeFile( output, html,function( e ) {
              console.log( Date.now(), ' write finish err : ', err);
            });
          });
        }
      });
    }
  });
});
