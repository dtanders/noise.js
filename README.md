This is a noise generator and UI based on [noise.js](#noisejs).

I used to use simplynoise a lot but got annoyed with the Flash requirement, overdone 
UI and memory leaks, so I forked [zacharydenton](https://github.com/zacharydenton/)'s 
noise library, refactored it a bit, and made my own.

noiseMaker.js
========

noiseMaker.js uses the convenient noise production nodes added to 
[AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext) 
by noise.js to produce soothing background noise with volume control and 
an oscillation option that replicates the features of the simplynoise UI in 
pure JS - as long as your browser supports it.

~~~~ {.javascript}
//create a noiseMaker instance
var noiseMaker = new NoiseMaker();

//constants
noiseMaker.colors; //key/value pairs of supported colors that you can call start with

//get/setters
noiseMaker.volume = 10 //ouput volume: 0 to 100
noiseMaker.period = 0 //oscillatior frequency denominator: 1/(n > 0)Hz; 0 = off (seconds between peaks)
noiseMaker.magnitude = 60 //oscillation magnitude: 0 to 100

//methods
noiseMaker.start([color || 'brown', bufferSize (passed to noise.js methods]);
noiseMaker.stop();

//any invalid input should be silently ignored
~~~~

noise.js
========

noise.js is a library that provides noise generators for the Web Audio
API. Currently, noise.js provides generators for white noise, pink
noise, and brown noise.

Here's [a demo](http://jsfiddle.net/szms8/6/) of
both noise modulating oscillators and oscillators modulating noise.

Usage Examples
-----

### White Noise

Create a white noise generator and route it to the output:

~~~~ {.javascript}
var context = new webkitAudioContext();
var whiteNoise = context.createWhiteNoise();
whiteNoise.connect(context.destination);
~~~~

### Pink Noise

Create a pink noise generator and route it to the output:

~~~~ {.javascript}
var context = new webkitAudioContext();
var pinkNoise = context.createPinkNoise();
pinkNoise.connect(context.destination);
~~~~

Modulate a sawtooth oscillator with filtered pink noise:

```javascript
var context = new webkitAudioContext();
var pinkNoise = context.createPinkNoise();
var pinkGain = context.createGainNode();
var pinkFilter = context.createBiquadFilter();
pinkGain.gain.value = 100;
pinkFilter.frequency.value = 1.618;
pinkNoise.connect(pinkFilter);
pinkFilter.connect(pinkGain);

var saw = context.createOscillator();
saw.type = saw.SAWTOOTH;
saw.frequency.value = 440.0;
var sawGain = context.createGainNode();
sawGain.gain.value = 0.3;

saw.start(0);
saw.connect(sawGain);
pinkGain.connect(saw.frequency);
sawGain.connect(context.destination);
```

### Brown Noise

Create a brown noise generator and route it to the output:

~~~~ {.javascript}
var context = new webkitAudioContext();
var brownNoise = context.createBrownNoise();
brownNoise.connect(context.destination);
~~~~

Modulate the brown noise amplitude to simulate the sound of the ocean:

```javascript
var context = new webkitAudioContext();
var brownNoise = context.createBrownNoise();
var brownGain = context.createGainNode();
brownGain.gain.value = 0.3;
brownNoise.connect(brownGain);

var lfo = context.createOscillator();
lfo.frequency.value = 0.1;
var lfoGain = context.createGainNode();
lfoGain.gain.value = 0.1;

lfo.start(0);
lfo.connect(lfoGain);
lfoGain.connect(brownGain.gain);
brownGain.connect(context.destination);
```

  [the post on Noisehack]: http://noisehack.com/generate-noise-web-audio-api/
