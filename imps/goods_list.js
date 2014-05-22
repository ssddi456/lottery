define([
  '_'
],function(
  __
){
  var default_list = [{
      "name" : '三等奖',
      "pic"  : 'path_to_goods.png',
      "n"    : 20, // number of goods
      "split": 2,
      lv     : 1
    },{
      "name" : '二等奖',
      "pic"  : 'path_to_goods.png',
      "n"    : 9, // number of goods
      "split": 9,
      lv     : 2
    },{
      "name" : '一等奖',
      "pic"  : 'path_to_goods.png',
      "n"    : 1, // number of goods
      "split": 1,
      lv     : 3
    }];

  var list =  [];
  default_list.forEach(function( good ) {
    var total = good.n;
    var peer  = good.n = good.n / good.split;
    var name  = good.name
    _.range(good.split).forEach(function(i) {
      good.name =  name + ' (' + (peer * (i +1))+'/' + total + ')'
      list.push(JSON.parse(JSON.stringify(good)));
    });
  });
  return JSON.parse(JSON.stringify(list));
});