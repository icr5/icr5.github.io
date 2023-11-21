//HTML 숨기기
//let hideCP = document.getElementsByClassName('control-panel'); // Hide
//hideCP.style.display = "none";

//Hide or show control-panel
function toggleControl(){
  let controlPanel = document.getElementsByClassName('control-panel')[0];
  let controlButton = document.getElementById('controlButton');
  if (controlPanel.style.display === "none"){
    controlPanel.style.display = "block";
    controlButton.innerHTML = "Hide controls";
  } else {
    controlPanel.style.display = "none";
    controlButton.innerHTML = "Show controls";
  }     
}

//Get HTML elements
const videoElement = document.getElementsByClassName('input_video')[0];
const videoSelect = document.querySelector('select#videoSource');
const selectors = [videoSelect];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const showTracking = document.getElementById("showTracking");
const selfie = document.getElementById("selfie");
const fpsoutput = document.getElementById("fps");
const playFile = document.getElementById("playFile");
const playLoop = document.getElementById("playLoop");
const startRecord = document.getElementById("startRecord");
const stopRecord = document.getElementById("stopRecord");
const openMic = document.getElementById("openMic");
const micPreamp = document.getElementById("micPreamp");
const micPreampValue = document.getElementById("micPreampValue");
const playbackRateCheck = document.getElementById("playbackRateCheck");
const pitchShiftCheck = document.getElementById("pitchShiftCheck");
const pitchShiftAutomaticInput = document.getElementById("pitchShiftAutomaticInput");
const pingPongCheck = document.getElementById("pingPongCheck");
const pingPongAutomaticInput = document.getElementById("pingPongAutomaticInput");
const pingPongWet = document.getElementById("pingPongWet");
const pingPongWetValue = document.getElementById("pingPongWetValue");
const distortionCheck = document.getElementById("distortionCheck");
const distAutomaticInput = document.getElementById("distAutomaticInput");
const distWet = document.getElementById("distWet");
const distWetValue = document.getElementById("distWetValue");
const reverbCheck = document.getElementById("reverbCheck");
const reverbAutomaticInput = document.getElementById("reverbAutomaticInput");
const reverbWet = document.getElementById("reverbWet");
const reverbWetValue = document.getElementById("reverbWetValue");
const gainCheck = document.getElementById("gainCheck");
const gainControlInput = document.getElementById("gainControlInput");
const playerControlInput = document.getElementById("playerControlInput");
const distControlInput = document.getElementById("distControlInput");
const pitchShiftControlInput = document.getElementById("pitchShiftControlInput");
const reverbControlInput = document.getElementById("reverbControlInput");
const pingPongControlInput = document.getElementById("pingPongControlInput");
const loopAudioEffects = document.getElementById("loopAudioEffects");
const fileAudioEffects = document.getElementById("fileAudioEffects");
const micAudioEffects = document.getElementById("micAudioEffects");
let leftWrist, leftIndex, rightWrist, rightIndex, leftGesture, rightGesture;




const player4 = new Tone.Player('DRM.wav').toDestination();
const oneShot = new Tone.Player('Impact.wav').toDestination();

//Create gesture recognition


(function (global, exports, perf) {
  'use strict';

  function fixSetTarget(param) {
    if (!param) // if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }

  if (window.hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
    window.AudioContext = webkitAudioContext;

    if (!AudioContext.prototype.hasOwnProperty('createGain'))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
    if (!AudioContext.prototype.hasOwnProperty('createPeriodicWave'))
      AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;


    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() {
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function(maxDelayTime) {
      var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() {
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when, offset, duration ) {
          if ( offset || duration )
            this.noteGrainOn( when || 0, offset, duration );
          else
            this.noteOn( when || 0 );
        };
      } else {
        node.internal_start = node.start;
        node.start = function( when, offset, duration ) {
          if( typeof duration !== 'undefined' )
            node.internal_start( when || 0, offset, duration );
          else
            node.internal_start( when || 0, offset || 0 );
        };
      }
      if (!node.stop) {
        node.stop = function ( when ) {
          this.noteOff( when || 0 );
        };
      } else {
        node.internal_stop = node.stop;
        node.stop = function( when ) {
          node.internal_stop( when || 0 );
        };
      }
      fixSetTarget(node.playbackRate);
      return node;
    };

    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() {
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() {
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if (AudioContext.prototype.hasOwnProperty( 'createOscillator' )) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.start) {
          node.start = function ( when ) {
            this.noteOn( when || 0 );
          };
        } else {
          node.internal_start = node.start;
          node.start = function ( when ) {
            node.internal_start( when || 0);
          };
        }
        if (!node.stop) {
          node.stop = function ( when ) {
            this.noteOff( when || 0 );
          };
        } else {
          node.internal_stop = node.stop;
          node.stop = function( when ) {
            node.internal_stop( when || 0 );
          };
        }
        if (!node.setPeriodicWave)
          node.setPeriodicWave = node.setWaveTable;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }

  if (window.hasOwnProperty('webkitOfflineAudioContext') &&
      !window.hasOwnProperty('OfflineAudioContext')) {
    window.OfflineAudioContext = webkitOfflineAudioContext;
  }

}(window));

//Reset audio context
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});
//Tone.js nodes
const gainNode = new Tone.Gain();
const highpass = new Tone.Filter(30, "highpass");
const lowpass = new Tone.Filter(18000, "lowpass");
const limiter = new Tone.Limiter(-0.03);
//const vol = new Tone.Volume(-6);
const reverb = new Tone.Reverb(3);
const dist = new Tone.Distortion(0.8);
const pingPong = new Tone.PingPongDelay(0.2, 0.7);
const pitchShift = new Tone.PitchShift(-12);
const mult = new Tone.Multiply(6);
const mono = new Tone.Mono();
const mic = new Tone.UserMedia();
gainNode.connect(highpass);
highpass.connect(lowpass);
lowpass.connect(limiter);
limiter.toDestination();

//mic
mic.open().then(() => {
  //alert("If using mic input, please make sure audio output and input are from different sources (e.g. wear headphones), or you will get feedback");
  //console.log("mic open");
}).catch(e => {
  console.log("mic not open");
});
mic.mute = true;
mic.chain(mono, mult, pitchShift, dist, reverb, pingPong, gainNode);

micAudioEffects.addEventListener("change", function(){
  if (this.checked) {
    mic.chain(mono, mult, pitchShift, dist, reverb, pingPong, gainNode);
    } else {
    mic.disconnect();
    mic.connect(gainNode);
    }
  });

// Upload own audio file
let file = {};
let player;
let audio_file = document.getElementById("file-selector");
audio_file.onchange = function(){
  if (player) {player.stop()};
  setAudio(this.files);
};
function setAudio(files) {
  file = URL.createObjectURL(files[0]);
  player = new Tone.Player(file);
  player.loop = true;
  if (fileAudioEffects.checked){player.chain(pitchShift, dist, reverb, pingPong, gainNode);
    } else {player.connect(gainNode)};
}

playFile.addEventListener("change", function(){
  if (player) {
    if (this.checked) {
    player.start();
    } else {
     player.stop();
    }
  };
});


fileAudioEffects.addEventListener("change", function(){
  if (player) {
    if (this.checked) {
    player.chain(pitchShift, dist, reverb, pingPong, gainNode);
    } else {
     player.disconnect();
     player.connect(gainNode);
    }
  };
});

//================
//fileAudioEffects.addEventListener("change", function(){
//  if (player4) {
// 
//    player4.chain(pitchShift, dist, reverb, pingPong, gainNode);
//
//  };
//});

player4.chain(pitchShift);






//Record mic into buffer loop;
const actx = Tone.context;
const dest = actx.createMediaStreamDestination();
const recorder = new MediaRecorder(dest.stream);
let buffer = [];
let player2;
limiter.connect(dest);
startRecord.addEventListener("click", function(ev){
recorder.start();
});
stopRecord.addEventListener("click", function(ev){
  recorder.stop();
  recorder.ondataavailable = ev => buffer.push(ev.data);
  recorder.onstop = ev => {
    let blob = new Blob(buffer, {type: 'audio/ogg; codecs=opus' });
    let file2 = URL.createObjectURL(blob);
    let buffer1 = new Tone.Buffer(file2);
    player2 = new Tone.Player(buffer1);
    player2.loop = true;
    if (loopAudioEffects.checked){player2.chain(pitchShift, dist, reverb, pingPong, gainNode);
    } else {player2.connect(gainNode)};
  };
});

openMic.addEventListener('change', function() {
  if (this.checked) {
    mic.mute=false;
  } else {
    mic.mute=true;
  }
});

micPreamp.addEventListener("input", function(ev){
  mult.value = micPreamp.value;
  micPreampValue.innerHTML = micPreamp.value;
});

distWet.addEventListener("input", function(ev){
  dist.wet.value = distWet.value;
  distWetValue.innerHTML = distWet.value;
});

reverbWet.addEventListener("input", function(ev){
  reverb.wet.value = reverbWet.value;
  reverbWetValue.innerHTML = reverbWet.value;
});

pingPongWet.addEventListener("input", function(ev){
  pingPong.wet.value = pingPongWet.value;
  pingPongWetValue.innerHTML = pingPongWet.value;
});

playLoop.addEventListener("change", function(){
  if (player2) {
    if (this.checked) {
    player2.start();
    } else {
     player2.stop();
    }
  };
});

loopAudioEffects.addEventListener("change", function(){
  if (player2) {
    if (this.checked) {
    player2.chain(pitchShift, dist, reverb, pingPong, gainNode);
    } else {
     player2.disconnect();
     player2.connect(gainNode);
    }
  };
});

function scaleValue(value, from, to) {
  let scale = (to[1] - to[0]) / (from[1] - from[0]);
  let capped = Math.min(from[1], Math.max(from[0], value)) - from[0];
  return (capped * scale + to[0]);
}

function gainControl(controlValue) {
  gainNode.gain.rampTo((clamp(controlValue, 0, 1)), 0.05);  
}

function playerControl(controlValue) {
//  if (player2) {player2.playbackRate = (scaleValue(controlValue, [0, 1], [4, 0.2]))};
//  if (player) {player.playbackRate = scaleValue(controlValue, [0, 1], [4, 0.2])};  
//  player4.playbackRate = scaleValue(controlValue, [0, 1], [4, 0.2]); 
player4.playbackRate = scaleValue(controlValue, [0, 1], [0, 1.2]); 
}

function pitchShiftControl(controlValue) {
  pitchShift.pitch = (scaleValue(controlValue, [0, 1], [-12, 12]));
}
//=======================================================================



function pingPongControl(controlValue) {
  pingPong.wet.value = clamp(controlValue, 0, 1);
  pingPongWet.value = pingPong.wet.value.toFixed(2);
  pingPongWetValue.innerHTML = pingPong.wet.value.toFixed(2);
}

function distortionControl(controlValue) {
  dist.wet.value = clamp(controlValue, 0, 1);
  distWet.value = dist.wet.value.toFixed(2);
  distWetValue.innerHTML = dist.wet.value.toFixed(2);
}

function reverbControl(controlValue) {
  reverb.wet.value = clamp(controlValue, 0, 1);
  reverbWet.value = reverb.wet.value.toFixed(2);
  reverbWetValue.innerHTML = reverb.wet.value.toFixed(2);
}


let threshold  = 70;
function now () {return new Date().getTime()}


//sound engine
let effects_io = [
  {input:gainControlInput,        output:gainControl,           checkbox:gainCheck},
  {input:playerControlInput,      output:playerControl,         checkbox:playbackRateCheck},
  {input:distControlInput,        output:distortionControl,     checkbox:distortionCheck},
  {input:pitchShiftControlInput,  output:pitchShiftControl,     checkbox:pitchShiftCheck},
  {input:reverbControlInput,      output:reverbControl,         checkbox:reverbCheck},
  {input:pingPongControlInput,    output:pingPongControl,       checkbox:pingPongCheck},
];
function myMusic(leftIndex, leftWrist, rightIndex, rightWrist){ 
    
//  pitchShift.pitch = (scaleValue(leftIndex.x, [0, 1], [-12, 12]));
//    pitchShift.pitch = (scaleValue(leftIndex.y, [0, 1], [-12, 12]));
//    pitchShift.pitch = (scaleValue(leftIndex.y, [0, 1], [-12, 12]));
//    player4.playbackRate = (scaleValue(rightIndex.y, [0, 1], [4, 0.2]));
//    player4.playbackRate = (scaleValue(rightIndex.x, [0, 1], [1, 1]));

  if (! distortionCheck.checked) {dist.wet.value = 0; distWet.value = 0};
  if (! pitchShiftCheck.checked) {pitchShift.pitch = 0};
  if (! pingPongCheck.checked) {pingPong.wet.value = 0; pingPongWet.value = 0};
  if (! reverbCheck.checked) {reverb.wet.value = 0; reverbWet.value = 0};
  if (! gainCheck.checked) {gainNode.gain = 1};
  if (! playbackRateCheck.checked) {
    if (player2){player2.playbackRate = 1};
    if (player){player.playbackRate = 1};
    if (player4){player4.playbackRate = 1}};
    
    
  effects_io.forEach(io => {
    if(io.input.value === "leftIndexX" && leftIndex && io.checkbox.checked){io.output(leftIndex.x)};
    if(io.input.value === "leftIndexY" && leftIndex && io.checkbox.checked){io.output((1 - leftIndex.y))};
    if(io.input.value === "leftClosed" && leftIndex && io.checkbox.checked){io.output((scaleValue((Math.sqrt(((leftIndex.x - leftWrist.x)**2)+((leftIndex.y - leftWrist.y)**2))), [0.1, 0.4], [1, 0])))};
    if(io.input.value === "rightIndexX" && rightIndex && io.checkbox.checked){io.output(rightIndex.x)};
    if(io.input.value === "rightIndexY" && rightIndex && io.checkbox.checked){io.output((1-rightIndex.y))};
    if(io.input.value === "rightClosed" && leftIndex && io.checkbox.checked){io.output((scaleValue((Math.sqrt(((rightIndex.x - rightWrist.x)**2)+((rightIndex.y - rightWrist.y)**2))), [0.1, 0.4], [1, 0])))};
    if(io.input.value === "indexDistance" && leftIndex && rightIndex && io.checkbox.checked){io.output((Math.sqrt(((leftIndex.x - rightIndex.x)**2)+((leftIndex.y - rightIndex.y)**2))))};
  });  
}

//Calculate FPS
let counter = 0;
let counterTracker = new Date();


// ========================================================================
function onResults(results) {
  counter++;
  let now = new Date();
  let timeDiff = now.getTime() - counterTracker.getTime()
  if(timeDiff >= 1000){
    let fps = Math.floor(counter / (timeDiff/1000));
    fpsoutput.innerHTML = fps;
    // reset
    counter = 0;
    counterTracker = new Date();
  };

    
// ========================================================================

  //Draw landmarks on screen
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    
// pose if ========================================================================

  if (results.poseLandmarks) {
    for (let index = 0; index < results.poseLandmarks.length; index++) {
      const classification = results.poseLandmarks[index];
      const isRightHand = classification.label === 'Right';
//      const landmarks = results.poseLandmarks[index];
      if (showTracking.checked) {
        drawConnectors(
          canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
          {color: isRightHand ? '#fff' : '#056df5'}
        ),
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: isRightHand ? '#fff' : '#056df5',
        fillColor: isRightHand ? '#056df5' : '#fff',
        radius: (x) => {
          return lerp(x.from.z, -0.15, .1, 10, 1);
        }
      })};

//      let flandmark = landmarks.map(landmark => [landmark.x, landmark.y, landmark.z]);
//      est = GE.estimate(flandmark, 9.5);

//        if (isRightHand === false){
//          leftIndex = landmarks[8];
//          leftWrist = landmarks[0];
//
//          } else {
//          rightIndex = landmarks[8];
//          rightWrist = landmarks[0];
//
//        }
        
        rightIndex = results.poseLandmarks[19];
        rightWrist = results.poseLandmarks[16];
        leftIndex = results.poseLandmarks[20];
        
  canvasCtx.restore();
    //=============
        
        


    // ====== Play by Motion

    player4.loop = true;
  oneShot.loop = false;  
        
        
    if (results.poseLandmarks[26].y < 0.7 ) {
        player4.start();
    }
        
    if (results.poseLandmarks[25].y < 0.7 ) {
        player4.stop();
    }
        
        
    if (results.poseLandmarks[20].y < 0.2 ) {
            console.log("왼손");
//            oneShot.start(0, 0, 1);
          audio1.play();
    }
        
        
    if (results.poseLandmarks[19].y < 0.2 ) {
    console.log("오른손");
//        audio1.play();
//        player4.loop = true;
//        player4.start();
    }
        

        
  myMusic(leftIndex, leftWrist, rightIndex, rightWrist);

      };
  };
    
}
        
 //Audio file

   let audio1 = new Audio();
   audio1.src = 'oh.wav';





// ========================================================================
//const hands = new Hands({locateFile: (file) => {
//  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
//}});

const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
}});


//Toggle selfie view

pose.setOptions({selfieMode: true});

selfie.addEventListener('change', function() {
  if (this.checked) {
    hands.setOptions({selfieMode: true});
  } else {
    hands.setOptions({selfieMode: false});
  }
});


//hands.setOptions({
//  selfieMode: true,
//  maxNumHands: 2,
//  modelComplexity: 1,
//  minDetectionConfidence: 0.5,
//  minTrackingConfidence: 0.5
//});

//hands.onResults(onResults);
pose.onResults(onResults);

// ========================================================================

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();

function gotDevices(deviceInfos) {
  // Handles being called several times to update labels. Preserve values.
  const values = selectors.map(select => select.value);
  selectors.forEach(select => {
    while (select.firstChild) {
      select.removeChild(select.firstChild);
    }
  });
  for (let i = 0; i !== deviceInfos.length; ++i) {
    const deviceInfo = deviceInfos[i];
    const option = document.createElement('option');
    option.value = deviceInfo.deviceId;
    if (deviceInfo.kind === 'videoinput') {
      option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;
      videoSelect.appendChild(option);
    } else {
      console.log('Some other kind of source/device: ', deviceInfo);
    }
  }
  selectors.forEach((select, selectorIndex) => {
    if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
      select.value = values[selectorIndex];
    }
  });
}

navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  return navigator.mediaDevices.enumerateDevices();
}

function handleError(error) {
  console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
}

function start() {
  const videoSource = videoSelect.value;
  const constraints = {
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);
}

videoSelect.onchange = start;
