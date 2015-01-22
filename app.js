require([
  './imps/goods_list',
  './imps/name_list',
  './imps/lottory_history',
  'ko',
  'jquery',
  './imps/Random-name',
  './imps/lottory_runner'
],function(
  goods_list,
  name_list,
  lottory_history,
  ko,
  $,
  RandomName,
  lottory_runner
){
  var vm = {
    page              : ko.observable('lottory'),
    current_stage     : lottory_runner.current_stage,
    goods_description : lottory_runner.current_stage_name,
    isRunning         : ko.observable(false),
    isGaining         : ko.observable(false),
    exports           : function() {
                          lottory_runner.exports();
                        },
    exports_history   : function() {
                          lottory_history.exports();
                        },
    switchStage       : function( n ) {
                          lottory_runner.shiftStage( n );
                        },
    toggle : function( ob ) {
      return function() {
        ob(!ob());
      };
    },
    toggleRunning     : function() {
      var self = this;
      var randomNames = lottory_runner.current_res();
      if( ! this.isRunning() && !this.isGaining() ){

        if( lottory_runner.current_stage_end() ){
          return;
        }
        lottory_runner.next();
        randomNames.forEach(function( name ) {
          name.run();
        });
        this.isRunning(true);
      } else if ( this.isRunning() && !this.isGaining() ){
        function asyncGain() {
          var fin = randomNames.length;
          function gain() {
            if( fin ){
              fin --;
              randomNames[fin].finish( lottory_runner.gain()[0] );
              setTimeout(gain,1e3);
            } else {
              self.isGaining(false);
              self.isRunning(false);           
            }
          }
          gain();
          this.isGaining(true);
        }

        setTimeout(function() {
          
          syncGain();
            
        },1500);

        function syncGain() {
          lottory_runner.gain().forEach(function(name, i) {
            randomNames[i].finish(name);
          });

          self.isGaining(false);
          self.isRunning(false); 
        }
      } 
    },
    current_stage_end : lottory_runner.current_stage_end,

    next_stage        : function( self, e ) {
      e.stopPropagation();
      lottory_runner.shiftStage( lottory_runner.current_stage_idx() + 1 );
    },
    has_next_stage    : lottory_runner.has_next_stage,
    prev_stage        : function( self, e ) {
      e.stopPropagation();
      lottory_runner.shiftStage( lottory_runner.current_stage_idx() - 1 );
    },
    has_prev_stage    : lottory_runner.has_prev_stage,

    current_res       : lottory_runner.current_res,

    exports_res       : function( type ) {
      lottory_runner.exports( type )
    },

    edit_name_list    : ko.observable(false),
    
    edit_goods        : goods_list.edit,

    names             : name_list.names,
    picked_name       : lottory_runner.total_res,
    total_name        : name_list.length,
    goods             : goods_list,
    reset             : function() {
      localStorage.setItem( 'lottory_ret', '' );
      localStorage.setItem( 'goods',       '' );
      location.reload();
    }
  };

  vm.buttonText       = ko.computed(function() {
                          var gain = vm.isGaining();
                          var run  = vm.isRunning();

                          if( run && !gain ){
                            return '停止';
                          }
                          if( run && gain ){
                            return '...'
                          }
                          return '开始';
                        });
  vm.wrapper_Class    = ko.computed(function() {
                          var len = lottory_runner.current_res().length;
                          var lv = len > 6
                                      ? 1
                                      : 3;
                          return 'wrapper lv' + lv;
                        });
  if( name_list.names() == 'xxx' ){
    vm.page('help');
  }
  ko.applyBindings(vm);
});