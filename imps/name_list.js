define([
  'ko'
],function(
  ko
){
  var default_names = ['xxx'];

  var names = ko.observable('');
  var t_name = localStorage.getItem('name_list');
  if( t_name ){
    names( t_name );
  }else{
    names(default_names.join('\r\n'));
  }

  var name_list = ko.computed(function() {
                    localStorage.setItem('name_list', names() );
                    return names().split(/[\r\n]+/g);
                  });
  var ret = name_list();
  ret.names = names;

  return ret;
}); 