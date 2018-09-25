(function ( $ ) {
 
    $.fn.popoverx = function( options ) {
 
        var options = $.extend({ styleClass: ''}, options );
        options = $.extend({
	        html : true,
	        template: '<div class="popover ' + options.styleClass + '" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
	        content: function() {
	          var content = $(this).attr("data-content-id");
	          //console.log('content:' + content + ' ' + $(content).html())
	          return $(content).html();
	        }
	    }, options );
        
        return this.popover(options);
 
    };
 
}( jQuery ));