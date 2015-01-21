define([
  'ko',
  './name_list'
],function(
  ko,
  name_list
){
  function RandomName( name ) {
    this.interval = 200;
    this.text = ko.observable( name || '');
  }
  var fn = RandomName.prototype;
  fn.run = function() {
    var _name_list = name_list;
    var self = this;

    this.timer = setTimeout(function() {
      self.text( 
        _name_list[(Math.random() * _name_list.length ) | 1] );
      self.run();
    }, this.interval);
  }
  fn.finish = function( name ) {
    if( this.timer ){
      this.timer = clearTimeout(this.timer);
    }
    this.text(name);
  }
  return RandomName;
});