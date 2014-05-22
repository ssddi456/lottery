define([

],function(

){
  return function( arr ) {
    var t, idx;
    for(var i = arr.length - 1; i > 0; i -- ){
      idx = (Math.random() * i)| 1;
      t = arr[idx];
      arr[idx] = arr[i];
      arr[i] = t;
    }
  }
});