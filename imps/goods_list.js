define([
  'ko',
  '_'
],function(
  ko,
  __
){
  var default_list = [{
    name  : '三等奖',
    peer  : 10,
    total : 20
  },{
    name  : '二等奖',
    peer  : 9,
    total : ''
  },{
    name  : '一等奖',
    peer  : 1,
    total : ''
  }];


  var ret = ko.observableArray();
  var defaults= JSON.parse(localStorage.getItem('goods') || '[]');
  ret( defaults.length ? defaults : default_list );

  ret.edit = ko.observable(false);
  ret.edit.subscribe(function() {
    console.log(' write goods');
    setTimeout(function() {
      localStorage.setItem('goods', JSON.stringify(ret())); 
    })
  });

  return ret;
});