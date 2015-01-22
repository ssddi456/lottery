define([
  'ko',
  '_'
],function(
  ko,
  __
){
  var default_list = [{
    name  : '奖',
    peer  : 10,
    total : 20
  }];


  var ret = ko.observableArray();
  var defaults= JSON.parse(localStorage.getItem('goods') || '[]');
  ret( defaults.length ? defaults : default_list );

  ret.edit = ko.observable(false);
  ret.save = function(){
    console.log(' write goods');
    setTimeout(function() {
      localStorage.setItem('goods', JSON.stringify(ret())); 
    })
  };

  return ret;
});