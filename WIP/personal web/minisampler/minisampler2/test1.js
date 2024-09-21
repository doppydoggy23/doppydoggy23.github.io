"use strict";


let globals = {
  allSamples:[],
}

function initializeUI() {

      

/*    document.addEventListener("keydown", (event) => {
        if (event.repeat) // avoid repeated keystrokes
            return;
        keyPressed(event.keyCode);        
        // do something
        //let id=howlerSound.play();
        //howlerSound.rate(0.5);
        //howlerSound.play();
        //howlerSound.play();
      });*/
/*    document.addEventListener("keyup", (event) => {
        if (event.repeat)
            return;
        keyReleased(event.keyCode);
        // do something
      });
*/
      //console.log ("initializeUI()");


  loadSamples();

  //attach to the track length range controller its change event handler
  document.getElementById("NoteRange").addEventListener('sl-change', event => {
    let relfreq=getNoteRelativeFrequency(document.getElementById("NoteRange").value);
    let volume=document.getElementById("VolumeRange").value;
    playSampleByNumber(0, relfreq, volume);
    //console.log("val:"+document.getElementById("NoteRange").value);
  });
      
}

function getNoteRelativeFrequency(rangePosition) {
  let negativeRelFreqs=[415/440, 392/440, 369/440, 349/440, 329/440, 311/440, 293/440, 277/440, 261/440];
  let positiveRelFreqs=[466/440, 493/440, 523/440, 554/440, 587/440, 622/440, 659/440, 698/440, 739/440];
  if (rangePosition==0)
    return 1;
  if (rangePosition<0)
    return negativeRelFreqs[(rangePosition*-1)-1];
  if (rangePosition>0)
    return positiveRelFreqs[rangePosition-1];
}

function loadSamples () {

  //list of mp3 samples
  const MP3files=["bell1.mp3", "elec1.mp3"];

  //mark buffers as null
  for (let i=0; i<MP3files.length; i++) {
    globals.allSamples[i]=null;
  }

  const audioContext = new AudioContext();

  for (let i=0; i<MP3files.length; i++) {
    fetch(MP3files[i])
    .then(response => response.arrayBuffer())
    .then(buffer => audioContext.decodeAudioData(buffer))
    .then(myBuffer => globals.allSamples[i]=myBuffer);
    
  }
}

function playSampleByNumber(number, pitchShift=1.0, volume=1) {

  if ((globals.allSamples==null)||(globals.allSamples[number]==null)) {
    return;
  }

  const audioContext = new AudioContext();

  const source = audioContext.createBufferSource();
  source.buffer = globals.allSamples[number];
  source.playbackRate.value = pitchShift;

  const myGainNode = audioContext.createGain();
  myGainNode.gain.value = volume;

  source.connect(myGainNode);
  myGainNode.connect(audioContext.destination);

  source.start(0);
}

function PlayBellButtonClick() {
  playSampleByNumber(0);
}
function PlayElec1ButtonClick() {
  playSampleByNumber(1);
}

function keyPressed(keyCode) {
    //document.getElementById("bamboosound").play();
    //let soundNode=document.getElementById("bamboosound").cloneNode();
    //soundNode.volume=volume;
    //soundNode.play();

}

function keyReleased(keyCode) {
    //console.log("keyReleased :"+keyCode)  
}

async function Play2ButtonClick() {
/*  const context = new AudioContext();
  let myAudio= await loadSample("elec1.mp3", context);
  playSample(myAudio, 2, context);

  //let buffer = File.readAllBytes(document.getElementById("sound1"));
  */
}


function loadSample(url, audioCtx) {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .then(buffer => audioCtx.decodeAudioData(buffer));
}

function playSample(sample, rate, audioCtx) {
  const source = audioCtx.createBufferSource();
  source.buffer = sample;
  source.playbackRate.value = rate;
  source.connect(audioCtx.destination);
  source.start(0);
}


function PlayButtonClick() {
    //console.log ("PlayButtonClick()");

/*    const context = new AudioContext();

    function loadSample(url) {
      return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => context.decodeAudioData(buffer));
    }
  */  
    /*function playSample(sample) {
      const source = context.createBufferSource();
      source.buffer = sample;
      source.connect(context.destination);
      source.start(0);
    }*/

/*    function playSample(sample, rate) {
      const source = context.createBufferSource();
      source.buffer = sample;
      source.playbackRate.value = rate;
      source.connect(context.destination);
      source.start(0);
    }
    
    loadSample('bell1.mp3')
      .then(sample => playSample(sample, 0.5));
      */
/*      let sample=loadSample('bell1.mp3');
      playSample(sample, 0.5);*/


      //ToDo: play several samples at the same time
}


