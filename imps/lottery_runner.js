define([
  '../libs/download',
  '../conf/conf',
  './shuffle',
  './name_list',
  './goods_list'
],function(
  download,
  conf,
  shuffle,
  name_list,
  goods_list
){
  var current_stage_idx     = 0;
  var current_stage_process = 0;

  var current_stage;

  function check_sum () {
    if( goods_list.reduce(function( pre, cur) {
          return pre + cur.n;
        },0) < name_list.length 
    ){
      return false;
    }
  }

  var lottory_ret = {};



  var lottory_runner = {
    gain : function ( n ) {
      
      n = n || 1;
      // init logic
      if( ! current_stage ){
        current_stage = goods_list[current_stage_idx];
      }
      // 切换stage 
      if( current_stage_process > current_stage.n ){
        current_stage_idx ++;
        current_stage = goods_list[current_stage_idx];
        if( ! current_stage ){
          throw 'lottory end';
        }

        current_stage_process = 0;
      }

      // 判断当前应该抽几个
      if( n > current_stage.n - current_stage_process ){
        n = current_stage.n - current_stage_process;
      }
      // 洗牌
      shuffle(name_list);
      // 抽出头n个
      var ret = name_list.slice(0, n );

      lottory_ret[current_stage_idx] = lottory_ret[current_stage_idx].concat(ret);
      current_stage_process += n;

      if( conf.no_repick ){
        name_list = name_list.slice(n);
      }
      return ret;
    },
    record : function() {
      var record = JSON.stringify(lottory_ret);
      // write to storage
    },
    exports : function() {
      var record = JSON.stringify(lottory_ret);
      download('lottory_ret.json', record);
    },
    init    : function() {
      // load from storage
    }
  };

  lottory_runner.init();
  if( !lottory_ret[0] ){
    goods_list.forEach(function(content, idx) {
      lottory_ret[ idx ] = [];
    });
  }
  return lottory_runner;
});