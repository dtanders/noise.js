(function(AudioContext) {
	var MAX_BUFFER = 16384;
	
	function whiteNoiseData (bufferSize) {
		var data = new Array(bufferSize);
		return function () {
			for (var i = 0; i < bufferSize; ++i) {
				data[i] = Math.random() * 2 - 1;
			}
			return data;
		}
	}
	
	function redNoiseData (bufferSize) {
		var b0, b1, b2, b3, b4, b5, b6, noise = whiteNoiseData(bufferSize);
		b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
		return function () {
			var acc, data = noise();
			for (var i = 0; i < bufferSize; ++i) {
				acc = data[i];
				b0 = 0.99886 * b0 + acc * 0.0555179;
				b1 = 0.99332 * b1 + acc * 0.0750759;
				b2 = 0.96900 * b2 + acc * 0.1538520;
				b3 = 0.86650 * b3 + acc * 0.3104856;
				b4 = 0.55000 * b4 + acc * 0.5329522;
				b5 = -0.7616 * b5 - acc * 0.0168980;
				data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + acc * 0.5362) * 0.11;
				b6 = acc * 0.115926;
			}
			return data;
		}
	}
	
	function brownNoiseData (bufferSize) {
		var last = 0.0, noise = whiteNoiseData(bufferSize);
		return function () {
			var acc, data = noise();
			for (var i = 0; i < bufferSize; ++i) {
				last = (last + (0.02 * data[i])) / 1.02;
				data[i] = last * 3.5;
			}
			return data;
		}
	}
	
	function genericNode (ctx, dataFactory, bufferSizeIn) {
		var bufferSize = Math.min(Math.abs(bufferSizeIn || MAX_BUFFER), MAX_BUFFER),
			 node = ctx.createScriptProcessor(bufferSize, 1, 1),
			 dataGen = dataFactory(bufferSize);
		
		node.onaudioprocess = function(e) {
			var output = e.outputBuffer.getChannelData(0),
				 data = dataGen();
			for (var i = 0; i < bufferSize; ++i) {
				output[i] = data[i];
			}
		}
		return node;
	}
	
	AudioContext.prototype.createWhiteNoise = function(bufferSize) {
		return genericNode(this, whiteNoiseData, bufferSize);
	};

	AudioContext.prototype.createPinkNoise = function(bufferSize) {
		return genericNode(this, redNoiseData, bufferSize);
	};

	AudioContext.prototype.createBrownNoise = function(bufferSize) {
		return genericNode(this, brownNoiseData, bufferSize);
	};
})(window.AudioContext || window.webkitAudioContext);
