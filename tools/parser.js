var jade = require('jade');
var fs = require('fs');
var path = require('path');
var less = require('less');
var _ = require('../libs/underscore-min');

var configures = [{
  root     : '../tpls',
  entrance : 'index.jade',
  output   : '../index.html',
  ext      : '.jade',
  render   : function( file, conf, done ) {
    jade.renderFile( file, done );
  }
},{
  root     : '../resources',
  entrance : 'app.less',
  output   : '../resources/app.css',
  ext      : '.less',
  render   : function( file, conf, done ) {
    fs.readFile(file, 'utf8', function( err, code) {
      if( err ){
        return done(err);
      }

      less.render(code,
        { 
          filename : path.basename(file),
          paths    : [conf.root]
        },
        function(err, tree) {
          done(err, tree && tree.css);
        });
    })
  }
}];

configures.forEach(function( conf ) {
    
  fs.readdir(conf.root,function( err, files ) {
    console.log( conf.root , err );
    files.forEach(function( source ) {
      if( path.extname( source ) == conf.ext){
        fs.watch( conf.root + '/' + source,
          _.debounce(function( e ) {
            if( e == 'change' ){
              console.log( e );
              console.log( source, 'changed' );
              console.time('compile');
  
              var data = conf.render( conf.root + '/' + conf.entrance, conf,
                  function(err, data) {
                  console.timeEnd('compile');
                  console.log( Date.now(), ' compile finish err : ', err);
                  fs.writeFile( conf.output, data,function( e ) {
                    console.log( Date.now(), ' write finish err : ', err);
                  });
                });
            }
          },100));
      }
    });
  });
})
