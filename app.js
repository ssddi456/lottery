require([
  './imps/name_list',
  './imps/lottory_history',
  'ko',
  'jquery',
  './imps/Random-name',
  './imps/lottery_runner'
],function(
  name_list,
  lottory_history,
  ko,
  $,
  RandomName,
  lottery_runner
){
  var vm = {
    goods_description : lottery_runner.current_stage_name,
    isRunning         : ko.observable(false),
    isGaining         : ko.observable(false),
    exports           : function() {
                          lottery_runner.exports();
                        },
    exports_history   : function() {
                          lottory_history.exports();
                        },
    switchStage       : function( n ) {
                          lottory_runner.shiftStage( n );
                        },
    toggleRunning     : function() {
      var self = this;
      var randomNames = lottery_runner.current_stage_res();
      if( ! this.isRunning() && !this.isGaining() ){

        if( lottery_runner.current_stage_end() ){
          return
        }

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
              randomNames[fin].finish( lottery_runner.gain()[0] );
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
          lottery_runner.gain( lottery_runner.current_stage().n ).forEach(function(name, i) {
            randomNames[i].finish(name);
          });

          self.isGaining(false);
          self.isRunning(false); 
        }
      } 
    },
    current_stage_end : lottery_runner.current_stage_end,

    next_stage        : function( self, e ) {
      e.stopPropagation();
      lottery_runner.shiftStage( lottery_runner.current_stage_idx() + 1 );
    },
    has_next_stage    : lottery_runner.has_next_stage,
    prev_stage        : function( self, e ) {
      e.stopPropagation();
      lottery_runner.shiftStage( lottery_runner.current_stage_idx() - 1 );
    },
    has_prev_stage    : lottery_runner.has_prev_stage,

    current_stage_res : lottery_runner.current_stage_res,

    exports_res       : function() {
      lottery_runner.exports()
    },

    edit_name_list    : ko.observable(false),

    names             : name_list.names
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
                          return 'wrapper lv' + lottery_runner.current_stage().lv ;
                        });

  ko.applyBindings(vm);

});