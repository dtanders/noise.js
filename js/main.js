(function ($) {
	"use strict";
	
	var noisy = {},
		playing = false,
		defaults = {
			volume: 20,
			magnitude: 60,
			period: 0,
			color: 'brown'
		};
	
	function persist (key, val) {
		if ( Modernizr.localstorage ) {
			localStorage[key] = val;
		} else {//fuck you, dad, I'll do what I want
			document.cookie = key + '=' + val + '; path=/; expires=Fri Dec 25 2037 00:00:00 GMT-0600 (Central Standard Time)';
		}
	}
	
	function lookup (key, backup) {
		if (Modernizr.localstorage) {
			return localStorage[key] || backup;
		} else {
			var cookies = [];
			if (!navigator.cookieEnabled || document.cookie.indexOf(key) < 0) {
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

	function finalizeSetup ($colors, $volume, $period, $magnitude) {
		noisy = new NoiseMaker();

		$colors.on('click', function (e) {
			var val = $(this).val();
			noisy.start(val);
			persist('color', val);
		});
		
		function bindInput ($sel, prop) {
			$sel.on('input', function () {
				var val = $sel.val();
				noisy[prop] = val;
				persist(prop, val);
			});
			noisy[prop] = $sel.val();
		}
		
		bindInput($volume, 'volume');
		bindInput($period, 'period');
		bindInput($magnitude, 'magnitude');
	}
	
	$(function () {
		var $colors = $('#buttons input'),
			$volume = $('#volume'),
			$period = $('#period'),
			$magnitude = $('#magnitude'),
			$playPause = $('#play-pause');
		
		$('#buttons input[value='+lookup('color', defaults.color)+']').prop('checked', true);
		$volume.val(lookup('volume', defaults.volume));
		$period.val(lookup('period', defaults.period));
		$magnitude.val(lookup('magnitude', defaults.magnitude));

		$playPause.on('click', function(e){
			e.stopPropagation();
			try {
				if (playing) {
					noisy.stop();
					$playPause.text("▶ Play");
					playing = false;
				} else {
					if (!noisy.colors) {
						finalizeSetup($colors, $volume, $period, $magnitude);
					}
					noisy.start($colors.find(':selected').val());
					$playPause.text("⏸ Pause");
					playing = true;
				}
			} catch (ex) {
				$('#nosound').removeClass('hidden');
				$('form').addClass('hidden');
				console.log(ex.message);
			}
			return false;
		});
	});
    window.noisy = noisy;
})($);