function NoiseMaker () {
	"use strict";
	var me = this,
		AudioContext = window.AudioContext || window.webkitAudioContext,
		ctx = new AudioContext(),
		nodeConstructors = {
			red: ctx.createPinkNoise.bind(ctx),
			pink: ctx.createPinkNoise.bind(ctx),
			white: ctx.createWhiteNoise.bind(ctx),
			brown: ctx.createBrownNoise.bind(ctx)
		},
		current = false,
		gain = ctx.createGain(),
		oscillatingGain = ctx.createGain(),
		oscillatorLimit = ctx.createGain(),
		oscillator = ctx.createOscillator(),
		oscillatorConnected = false; //because you can't stop and then start them again
		// just fake it by disconnectiong and re-connecting
	
	function setVolume (vol) {
		if (isNaN(vol)) {
			return;
		}
		gain.gain.value = clampPositive(vol, 100) / 100;
	}
	
	function getVolume () {
		return gain.gain.value * 100;
	}
	
	function setPeriod (sec) {
		sec = Math.abs(sec);
		if (sec == 0) {
			if (oscillatorConnected) {
				oscillator.disconnect();
				oscillatingGain.gain.value = 1;
				oscillatorConnected = false;
			}
		} else {
			if (!oscillatorConnected) {
				oscillator.connect(oscillatorLimit);
				oscillatorConnected = true;
			}
			oscillator.frequency.value = 1/sec;
		}
	}
	
	function getPeriod () {
		return 1/oscillator.frequency.value;
	}
	
	function getMagnitude () {
		return oscillatorLimit.gain.value * 100;
	}
	
	function setMagnitude (mag) {
		if (isNaN(mag)) {
			return;
		}
		oscillatorLimit.gain.value = clampPositive(mag, 100) / 100;
	}
	
	function stopNoise () {
		if (current) {
			current.disconnect(gain);
		}
		return me;
	}
	
	function startNoise (color, bufferSize) {
		stopNoise();
		color = (color || 'brown').toLowerCase();
		if (!nodeConstructors[color]) {
			throw new Error(color + " is not a supported noise color");
		}
		current = nodeConstructors[color](bufferSize);
		current.connect(gain);
		return me;
	}
	
	function makeProp (propName, config) {
		Object.defineProperty(me, propName, config);
	}
	
	function clampPositive (num, limit) {
		return Math.min(limit, Math.abs(num));
	}
	
	gain.connect(oscillatingGain);
	oscillator.start();
	oscillatorLimit.connect(oscillatingGain.gain);
	oscillatingGain.connect(ctx.destination);
	makeProp('volume', {get: getVolume, set: setVolume });
	makeProp('period', {get: getPeriod, set: setPeriod });
	makeProp('magnitude', {get: getMagnitude, set: setMagnitude });
	makeProp('stop', {value: stopNoise});
	makeProp('start', {value: startNoise});
	makeProp('colors', {value: {red: 'red', pink: 'pink', white: 'white', brown: 'brown'}});
}