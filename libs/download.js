(function(){
    function download ( filename, content ) {
    var blob     = new Blob([content],{ type: "text/plain; charset=utf-8" }),
        type     = blob.type,
        force_saveable_type = 'application/octet-stream';

    if (type && type != force_saveable_type) {
        blob = blob.slice( 0, blob.size, force_saveable_type);
    }
    var url = 'data:text/paint; utf-8,' + encodeURIComponent( content );
    var a = document.createElementNS('http://www.w3.org/1999/xhtml','a');
    a.href = url;
    a.download = filename;

    var e = document.createEvent('MouseEvents');
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);

    var obj_Url = webkitURL.createObjectURL(blob);
    webkitURL.revokeObjectURL(obj_Url);
  }

  if( typeof define === 'function' ){
    define([],function(){ return download;});
  } else {
    window.download_file = download;
  }
})()
