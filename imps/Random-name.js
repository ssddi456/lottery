define([
  './name_list'
],function(
  name_list
){
  function RandomName( $el ) {
    this.el = $el;
    this.interval = 200;
  }
  var fn = RandomName.prototype;
  fn.run = function() {
    var self = this;
    if( !this.timer ){
      this.el.css('background', 'yellow');
    }
    this.timer = setTimeout(function() {
      self.el.text( 
        name_list[(Math.random() * name_list.length ) | 1] );
      self.run();
    }, this.interval);
  }
  fn.finish = function( name ) {
    if( this.timer ){
      this.timer = clearTimeout(this.timer);
    }

    this.el.text(name)
    .css('background', 'green');
  }
  return RandomName;
});