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

  var lottory_ret = JSON.parse(localStorage.getItem('lottory_ret')||'{}');

  var lottory_runner = {
    next : function() {
      var n = Math.min(current_stage.peer, 
          current_stage.total - current_stage.process );  
      this.current_res.removeAll();
      var self = this;
      if( current_stage.end ){
        n = current_stage.peer;
        lottory_ret[current_stage_idx()].res.slice(0,n)
          .forEach(function( name ) {
            self.current_res.push( 
                new RandomName(name));
          })
      } else {
         _.range(n)
          .forEach(function( name ) {
            self.current_res.push( 
                new RandomName('尚未抽取'));
          })
      }

    },
    gain : function ( n ) {

      // 判断当前应该抽几个
      n = Math.min(current_stage.peer, 
          current_stage.total - current_stage.process );
      // 洗牌
      shuffle(name_list);
      // 抽出头n个
      var ret = name_list.slice( -1 * n );

      lottory_history.log('time', Date.now(), 'idx', current_stage.name, 'gainer', ret );

      _.each(
        _.range(
          current_stage.process,
          current_stage.process+n),
        function( idx, i ) {
          current_stage.res[idx] = ret[i];
        })

      current_stage.process += n;
      this.total_res( this.total_res() + n );
      if( conf.no_repick ){
        name_list = name_list.slice(0, name_list.length - n);
      }
      if( current_stage.process >= current_stage.total ){
        current_stage.end = true;
        this.current_stage_end(true);
      }
      current_stage.status( '(' + current_stage.process + '/' + current_stage.total + ')' );

      localStorage.setItem('lottory_ret',JSON.stringify(lottory_ret));
      return ret;
    },
    exports : function( type ) {
      if( type == 'cvs' ){
        var concat = Array.prototype.concat;
        var concat_call = Function.prototype.call.bind(concat);

        download('lottory_ret.cvs', 
          _.flatten(
            _.map(lottory_ret,function( ret ) {
                return (ret.res||[]).map(function( name ) {
                  return name + ',' + ret.name;
                });
              }))
            .join('\n'))
      } else {
        var record = JSON.stringify(lottory_ret);
        download('lottory_ret.json', record);
      }
    },
    init    : function() {
      // load from storage
      if( !current_stage ){
        this.shiftStage(current_stage_idx());
        this.next();
      }
    },
    shiftStage : function( n ) {

      n = Math.max( 0, Math.min(n, goods_list().length - 1 ));

      current_stage_idx(n);

      var res = lottory_ret[n].res;


      current_stage         = goods_list()[n];
      current_stage.process = current_stage.process || res.length;
      current_stage.total   = current_stage.total || Infinity;
      current_stage.res     = res;
      current_stage.status  = current_stage.status || ko.observable('('+ current_stage.process + '/' + current_stage.total + ')');
      current_stage.end = current_stage.process >= current_stage.total;

      this.current_stage_name( current_stage.name );
      this.current_stage_end( current_stage.end );

      this.has_next_stage( n < goods_list().length - 1 );
      this.has_prev_stage( n > 0 );

      this.current_stage(current_stage);
      this.next();
    },

    current_stage      : ko.observable({}),
    total_res          : ko.observable(0),
    current_res        : ko.observableArray([]),
    current_stage_idx  : current_stage_idx,
    current_stage_name : ko.observable(''),
    current_stage_end  : ko.observable(false),

    has_next_stage     :  ko.observable(true),
    has_prev_stage     :  ko.observable(true)

  };

  if( !lottory_ret[0] ){
    goods_list().forEach(function(content, idx) {
      lottory_ret[ idx ] = {
        name: content.name,
        res : []
      };
    });
  } else {
    var total_res = 0;
    _.each(lottory_ret,function( ret ) {
      total_res += ret.res.length;
    });
    lottory_runner.total_res( total_res );
  }

  lottory_runner.init();
  return lottory_runner;
});