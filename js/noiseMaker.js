//based on http://noisehack.com/generate-noise-web-audio-api/
function NoiseMaker(){
	"use strict";
	var me = this,
		 audioContext = window.AudioContext || window.webkitAudioContext || 
				window.msAudioContext || window.oAudioContext || window.mozAudioContext,
		 ctx = new AudioContext(),
		 current = false,
		 gain = ctx.createGain(),
		 oscillatingGain = ctx.createGain(),
		 oscillatorLimit = ctx.createGain(),
		 oscillator = ctx.createOscillator(),
		 oscillatorConnected = false; //because stopping one and starting it back up is a no-no
	
	function setVolume (to) {
		gain.gain.value = to / 100;
	}
	
	function getVolume () {
		return gain.gain.value * 100;
	}
	
	function setPeriod (sec) {
		if (sec === 0) {
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
	
	function setMagnitude (pct) {
		oscillatorLimit.gain.value = pct / 100;
	}
	
	function stopNoise() {
		if (current) {
			current.disconnect();
		}
		return me;
	}
	
	function startNoise(color, bufferSize) {
		stopNoise();
		switch ((color || 'brown').toLowerCase()) {
			case 'white': current = ctx.createWhiteNoise(bufferSize);
				current.connect(gain);
				break;
			case 'red':
			case 'pink':
				current = ctx.createPinkNoise(bufferSize);
				current.connect(gain);
				break;
			default:
				current = ctx.createBrownNoise(bufferSize);
				current.connect(gain);
		}
		return me;
	}
	
	function makeProp(propName, config) {
		Object.defineProperty(me, propName, config);
	}
	
	setVolume(10);
	setMagnitude(60);
	setPeriod(0);
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