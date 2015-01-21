define([
  './Random-name',
  'ko',
  '_',
  './lottory_history',
  '../libs/download',
  '../conf/conf',
  './shuffle',
  './name_list',
  './goods_list'
],function(
  RandomName,
  ko,
  __,
  lottory_history,
  download,
  conf,
  shuffle,
  name_list,
  goods_list
){
  var current_stage_idx     = ko.observable(0);

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

      // 切换stage 
      if( current_stage.process > current_stage.n ){
        this.shiftStage( current_stage_idx() +1 );
        if( ! current_stage ){
          throw 'lottory end';
        }
      }

      // 判断当前应该抽几个
      if( n > current_stage.n - current_stage.process ){
        n = current_stage.n - current_stage.process;
      }
      // 洗牌
      shuffle(name_list);
      // 抽出头n个
      var ret = name_list.slice(0, n );

      lottory_history.log('time', Date.now(), 'idx', current_stage.name, 'gainer', ret );

      _.each(_.range(current_stage.process,current_stage.process+n),
        function( idx, i ) {
          current_stage.res[idx] = ret[i];
        })

      current_stage.process += n;

      if( conf.no_repick ){
        name_list = name_list.slice(n);
      }
      if( current_stage.process >= current_stage.n ){
        this.current_stage_end(true);
      }
      return ret;
    },
    record : function() {
      // write to storage
    },
    exports : function( type ) {
      if( type == 'cvs' ){
        download('lottory_ret.cvs', 
          goods_list
            .map(function( good ) {
              return (good.res||[]).map(function( name ) {
                name + ',' + good.name;
              });
            })
            .reduce(Array.prototype.concat.call)
            .join('\n'))
      } else {
        var record = JSON.stringify(goods_list);
        download('lottory_ret.json', record);
      }
    },
    init    : function() {
      // load from storage
      if( !current_stage ){
        this.shiftStage(current_stage_idx());
      }
    },

    shiftStage : function( n ) {

      n = Math.max( 0, Math.min(n, goods_list.length - 1 ));

      current_stage_idx(n);

      current_stage     = goods_list[n];
      current_stage.process = current_stage.process || 0;
      current_stage.res = current_stage.res || _.range(current_stage.n)
                                                .map(function() {
                                                  return '尚未抽取';
                                                });
      
      this.current_stage_name( current_stage.name );
      this.current_stage_end( current_stage.process >= current_stage.n );

      this.has_next_stage( n < goods_list.length - 1 );
      this.has_prev_stage( n > 0 );
      this.current_stage_res(current_stage.res.map(function( name ) {
                                return new RandomName( name );
                              })
                            );
      this.current_stage(current_stage);
    },

    current_stage      : ko.observable({}),

    current_stage_res  : ko.observableArray([]),
    current_stage_idx  : current_stage_idx,
    current_stage_name : ko.observable(''),
    current_stage_end  : ko.observable(false),

    has_next_stage  :  ko.observable(true),
    has_prev_stage  :  ko.observable(true)

  };

  lottory_runner.init();
  if( !lottory_ret[0] ){
    goods_list.forEach(function(content, idx) {
      lottory_ret[ idx ] = [];
    });
  }
  return lottory_runner;
});