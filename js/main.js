(function ($) {
	"use strict";
	
	var noisy = false;
	
	function persist(key, val) {
		if ( Modernizr.localstorage ) {
			localStorage[key] = val;
		} else {//fuck you, dad, I'll do what I want
			document.cookie = key + '=' + val + '; path=/; expires=Fri Dec 25 2037 00:00:00 GMT-0600 (Central Standard Time)';
		}
	}
	
	function lookup(key, backup) {
		if ( Modernizr.localstorage ) {
			return localStorage[key] || backup;
		} else {
			var cookies = [];
			if(!navigator.cookieEnabled || document.cookie.indexOf(key) < 0){
				return backup;
			}
			
			cookies = document.cookie.split(';');
			for (var i = 0; i < cookies.length; ++i) {
				if (cookies[i].indexOf(key) === 0 && cookies[i].indexOf('=') === key.length) {
					return cookies[i].split('=')[1];
				}
			}
			return backup;
		}
	}
	
	try {
		noisy = new NoiseMaker();
	} catch (ex) {
		console.log(ex.message);
	}

	$(function () {
		var $buttons = $('#buttons input'),
			 $volume = $('#volume'),
			 $period = $('#period'),
			 $magnitude = $('#magnitude');
		
		if (!noisy) {
			$('#nosound').removeClass('hidden');
			$('form').addClass('hidden');
			return;
		}
			
		$buttons.on('click', function (e) {
			var val = $(this).val();
			noisy.start(val);
			persist('color', val);
		});
		
		function bindInput ($sel, prop) {
			var initial = lookup(prop, noisy[prop]);
			$sel.val(initial)
			 .on('input', function () {
				var val = $sel.val();
				noisy[prop] = val;
				persist(prop, val);
			});
			noisy[prop] = initial;
		}
		
		bindInput($volume, 'volume');
		bindInput($period, 'period');
		bindInput($magnitude, 'magnitude');

		$('#' + lookup('color', 'brown')).click();
	});
    window.noisy = noisy;
})($);