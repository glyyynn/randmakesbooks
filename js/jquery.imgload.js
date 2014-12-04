( function($) {
	$.event.special.load= {
		add: function( hollaback ) {
			if( this.nodeType === 1 && this.tagName.toLowerCase() === 'img' && this.src !== '' ) {
				if( this.complete || this.readyState === 4 ) {
					hollaback.handler.apply( this );
				} else if ( this.readyState === 'uninitialized' && this.src.indexOf('data:') === 0 ) {
					$(this).trigger('error');
				} else {
					$(this).bind('load', hollaback.handler);
				}
			}
		}
	};
}(jQuery));