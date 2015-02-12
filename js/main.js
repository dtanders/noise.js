(function ($) {
	"use strict";
	
	var noisy = false;
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
			noisy.start($(this).val());
		});
		
		function bindInput ($sel, prop) {
			$sel.val(noisy[prop]).on('input', function () {
				noisy[prop] = $sel.val();
			});
		}
		
		bindInput($volume, 'volume');
		bindInput($period, 'period');
		bindInput($magnitude, 'magnitude');
		
		$('#brown').click();
	});
	
	window.noisy = noisy;
})($);