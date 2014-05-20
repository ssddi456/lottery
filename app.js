require([
  'jquery',
  './imps/Random-name',
  './imps/lottery_runner'
],function(
  $,
  RandomName,
  lottery_runner
){

  var $name = $('.name');
  var randomNames = [];
  $name.each(function() {
    randomNames.push( new RandomName($(this)) );
  });

  randomNames.reverse();
  randomNames.forEach(function( name ) {
    name.run();
  });

  var fin = randomNames.length;
  function gain() {
    if( fin ){
      fin --;
      randomNames[fin].finish( lottery_runner.gain()[0] );
      setTimeout(gain,1e3);
    } else {
      lottery_runner.exports();
    }
  }

  gain();

});