var url = '';
var popup = false;
var photo_height = 548;

// Shift photo : (which photo, which direction)

function shift_photo(p, direction) {
	var el = $('.photos', p);
	var on = $('div.on', el);
	if (direction == 1) {
		var new_el = on.next();
		if (new_el.length == 0) {
			new_el = $('div:first', el);
		}
	}
	else {
		var new_el = on.prev();
		if (new_el.length == 0) {
			new_el = $('div:last', el);
		}
	}
	on.removeClass('on');
	new_el.addClass('on');
	load_photo(new_el);
	//var total = $('div', el).length;
	//var current = new_el.attr('data-slide');
}

// Load photo function

function load_photo(el) {

	if (el.hasClass('waiting') && !el.hasClass('loading')) {

		// Handle class changes
		el.removeClass('waiting').addClass('loading');
		loading++;

		// Create a new image and bind function to it's load event
		// Function handles distance from top depending on image size
		// & class changes
		var i = new Image();
		$(i).bind('load', function(e) {
			var ph = parseInt(el.attr('data-height'));
			if (ph < photo_height) {
				$(this).css('top', Math.floor((photo_height - ph) / 2));
			}
			el.html(this).removeClass('loading');
			loading--;
		});
		i.src = el.attr('data-url');

	}

}

var loading = 0;
var x = 0;
var swiping = false;

// Begin of function execution

$(document).ready(function() {
	var scroll_me = $('html');
	if ($.browser.safari) {
		scroll_me = $('body');
	}
	/*** PHOTO STUFF ***/

	// Checks every second (1000) if "loading" is equal to 0.
	// If so, gets the first pic and loads it
	setInterval(function() {
		if (loading == 0) {
			var p = $('div.waiting').eq(0);
			if (p.length != 0) {
				load_photo(p);
				// load_caption_for(p);
			}
		}
	}, 1000);

	// Handles click event to shift photo

  	$('.project').mousemove(function(e) {
    	x = parseInt(e.pageX);
	});

	$('.project').click(function(e) {
		if (!swiping) {
			if (x > Math.ceil($(window).width() / 2)) {
				shift_photo(this, 1);
				// shift_caption(this, 1);
			}
			else {
				shift_photo(this, -1);
				// shift_caption(this, -1);
			}
		}
	});
	// Loads photos on initial page load
	// Loops through each .photos element, executing the function

	$('.photos').each(function() {
		var p = $('div', this).eq(0);
				p.addClass('on');
		load_photo(p);
	});

	// $('.captions').each(function() {
	// 	var p = $('div', this).eq(0);
	// 			p.addClass('on');
	// 	load_caption_for(p);
	// });

			// $('body').swipe({
				// swipeStatus: function(e, phase, direction) {
				// 	document.title = phase + '-' + direction;
				// },
				// threshold: 75,
			// 	allowPageScroll: 'vertical'
			// });
	/*** SWIPE STUFF ***/

	// Handles swipe event, using touchswipe.js, I imagine
	$('.project').swipe({
		swipeLeft: function() {
			shift_photo(this, 1);
		},
		swipeRight: function() {
			shift_photo(this, -1);
		},
		threshold: 75
	});
	/*** SCROLL STUFF ***/

	// Changes the url based on scroll height
	function watch_scroll() {
		var container = 607;
		var offset = 125;
		var number = 0;
		var x = scroll_me.scrollTop();
		if (x > container - offset) {
			number = Math.floor((x + offset) / container);
		}

		var new_url = $('.project').eq(number).attr('id').substr(2);
		// console.log([x, number, new_url]);
		if (new_url != url) {
			url = new_url;
			$('a.close').attr('href', '#/' + url);
			if (!popup) {
				document.location = '#/' + url;
			}
		}
	}
	//Manages page load depending on url link and junk

	function load_page() {
		var page = document.location.hash.toString().replace('#/', '');
		$('#info, #store').css('display', 'none');
		if (page == 'info' || page == 'store') {
			$('#' + page).css('display', '');
			popup = true;
		}
		else if (popup) {
			popup = false;
			watch_scroll();
		}
		else {
			popup = false;
		}
	}

	//Handles change in hash

	//Binds hashchange event to load_page function
	$(window).bind('hashchange', load_page);

	var page = document.location.hash.toString().replace('#/', '');
	if (page != '') {
		if (page != 'info' && page != 'store') {
			var el = $('#p_' + page);
			if (el.length == 0) {
				scroll_me.scrollTop(0);
			}
			else {
				url = page;
				var number = el.attr('data-number');
				scroll_me.scrollTop(number * 607);
			}
		}
		load_page();
	}
	if (url == '') {
		watch_scroll();
	}

	// Calls the watch_scroll function each time page is scrolled
	$(window).scroll(watch_scroll);
	//watch_scroll();

});
