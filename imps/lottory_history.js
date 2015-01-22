define([
  '../libs/download'
],function(
  download
){
  var history = [];
  history.log = function() {
    history.push( [].slice.call(arguments) );
    localStorage.setItem('lottory_history', JSON.stringify(history) );
  }
  history.exports = function() {
    download( 'lottory_history', localStorage.getItem('lottory_history') );
  }
  return history;
});