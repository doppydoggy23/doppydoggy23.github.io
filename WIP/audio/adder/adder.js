"use strict";

/*
This code belongs to pubic domain (2024)
*/

const GlobalConstants = {
    MaxWaveFrequency: 5000,
    MinWaveFrequency: 0,
    DefaultWaveFrequency: 440,
    numSinusoids: 11, // important. It says how many sinusoids (waves) we have to work with
}

const GlobalVariables = {
    signalProcessor: null,
    myAudioContext:null,
    isSoundTestRunning: false,
}


function initializeUI() {

/*    document.getElementById("HarmonicSwitch").addEventListener('sl-change', event => {
        HarmonicOnChangeHandler();
      });*/

    document.getElementById("W1FInput").addEventListener('sl-change', event => {
        W1FrequencyTextOnChange();
    });
    document.getElementById("W2FInput").addEventListener('sl-change', event => {
        W2FrequencyTextOnChange();
    });
    document.getElementById("W3FInput").addEventListener('sl-change', event => {
        W3FrequencyTextOnChange();
    });
    document.getElementById("W4FInput").addEventListener('sl-change', event => {
        W4FrequencyTextOnChange();
    });
    document.getElementById("W5FInput").addEventListener('sl-change', event => {
        W5FrequencyTextOnChange();
    });
    document.getElementById("W6FInput").addEventListener('sl-change', event => {
        W6FrequencyTextOnChange();
    });
    document.getElementById("W7FInput").addEventListener('sl-change', event => {
        W7FrequencyTextOnChange();
    });
    document.getElementById("W8FInput").addEventListener('sl-change', event => {
        W8FrequencyTextOnChange();
    });
    document.getElementById("W9FInput").addEventListener('sl-change', event => {
        W9FrequencyTextOnChange();
    });
    document.getElementById("W10FInput").addEventListener('sl-change', event => {
        W10FrequencyTextOnChange();
    });
    document.getElementById("W11FInput").addEventListener('sl-change', event => {
        W11FrequencyTextOnChange();
    });

    document.addEventListener("keydown", (event) => {
        if (event.repeat) // avoid repeated keystrokes
            return;
        keyPressed(event.keyCode);
        // do something
      });
    document.addEventListener("keyup", (event) => {
        if (event.repeat)
            return;
        keyReleased(event.keyCode);
        // do something
      });



}

// This function adjust the values of the GUI elements to make sure they are valid and within range
function AjustGUIForValidValues () {
    for (let i=1; i<=GlobalConstants.numSinusoids; i++) {
        //let value=parseInt(document.getElementById("W"+i+"FInput").value); //ToDo: inputing "50g00" doesn't detect it as NaN
        let value=document.getElementById("W"+i+"FInput").value; //ToDo: inputing "50g00" doesn't detect it as NaN
        if (isNaN(value)) {
            document.getElementById("W"+i+"FInput").value=""+GlobalConstants.DefaultWaveFrequency;
        }
        if (value<GlobalConstants.MinWaveFrequency) {
            document.getElementById("W"+i+"FInput").value=""+GlobalConstants.MinWaveFrequency;
        }
        if (value>GlobalConstants.MaxWaveFrequency) {
            document.getElementById("W"+i+"FInput").value=""+GlobalConstants.MaxWaveFrequency;
        }
    }
}

function W1FrequencySliderOnInput () {
    document.getElementById("W1FInput").value=document.getElementById("W1FRange").value;
    if (document.getElementById("SelectHarmonicsOptionRG").value==2) {
        adjustValuesForHarmonicsInGUI();
    }
    collectFormDataAndUpdateSignalProcessorValues();
}

function W2FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
    document.getElementById("W2FInput").value=document.getElementById("W2FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W3FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
    document.getElementById("W3FInput").value=document.getElementById("W3FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W4FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
    document.getElementById("W4FInput").value=document.getElementById("W4FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W5FrequencySliderOnInput(){
    document.getElementById("W5FInput").value=document.getElementById("W5FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W6FrequencySliderOnInput(){
    document.getElementById("W6FInput").value=document.getElementById("W6FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W7FrequencySliderOnInput(){
    document.getElementById("W7FInput").value=document.getElementById("W7FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W8FrequencySliderOnInput(){
    document.getElementById("W8FInput").value=document.getElementById("W8FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W9FrequencySliderOnInput(){
    document.getElementById("W9FInput").value=document.getElementById("W9FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W10FrequencySliderOnInput(){
    document.getElementById("W10FInput").value=document.getElementById("W10FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W11FrequencySliderOnInput(){
    document.getElementById("W11FInput").value=document.getElementById("W11FRange").value;
    collectFormDataAndUpdateSignalProcessorValues();
}


function W1FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W1FRange").value=document.getElementById("W1FInput").value;
    if (document.getElementById("SelectHarmonicsOptionRG").value==2) {
        adjustValuesForHarmonicsInGUI();
    }
    collectFormDataAndUpdateSignalProcessorValues();
}

function W2FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W2FRange").value=document.getElementById("W2FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W3FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W3FRange").value=document.getElementById("W3FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W4FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W4FRange").value=document.getElementById("W4FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W5FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W5FRange").value=document.getElementById("W5FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W6FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W6FRange").value=document.getElementById("W6FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W7FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W7FRange").value=document.getElementById("W7FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W8FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W8FRange").value=document.getElementById("W8FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W9FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W9FRange").value=document.getElementById("W9FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W10FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W10FRange").value=document.getElementById("W10FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function W11FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W11FRange").value=document.getElementById("W11FInput").value;
    collectFormDataAndUpdateSignalProcessorValues();
}

function WeightSliderOnInput() { // the same func for all Weight Sliders
    collectFormDataAndUpdateSignalProcessorValues();
}

// this function retrieves the values of the GUI elements after making sure they are correct and within range
function retrieveParsedValues() {
    AjustGUIForValidValues(); // ToDo: check if this function takes too much time, in case real time sound becomes laggy
/*    let W1F=parseInt(document.getElementById("W1FInput").value);
    let W2F=parseInt(document.getElementById("W2FInput").value);
    let W3F=parseInt(document.getElementById("W3FInput").value);*/

    let WFreqs=[];
    let WAmplitudes=[];

    for (let i=1; i<=GlobalConstants.numSinusoids; i++) {
        WFreqs[i-1]=document.getElementById("W"+i+"FInput").value;
        WAmplitudes[i-1]=document.getElementById("W"+i+"Weight").value;
    }

    let Attack=document.getElementById("AttackRange").value;
    let Decay=document.getElementById("DecayRange").value;
    let Sustain=document.getElementById("SustainDurationRange").value;
    let SustainVolume=document.getElementById("SustainVolumeRange").value;
    let Release=document.getElementById("ReleaseRange").value;

    //return {W1F, W2F, W3F};
    return {WFreqs, WAmplitudes, Attack, Decay, Sustain, SustainVolume, Release};
}

function PlayButtonClick() {
    //console.log (retrieveParsedValues());
    playSound(retrieveParsedValues());
}

function DownloadWAVClick() {
    downloadWAV(retrieveParsedValues());
}

// this function, adjust the values of the GUI elements to harmonics-based
function adjustValuesForHarmonicsInGUI(){
    let baseFreq=document.getElementById("W1FInput").value;
    for (let i=2; i<=GlobalConstants.numSinusoids; i++) {
        let harmFreq=baseFreq*i;
        if (harmFreq>GlobalConstants.MaxWaveFrequency) {
            harmFreq=GlobalConstants.MaxWaveFrequency;
        }
        document.getElementById("W"+i+"FInput").value=harmFreq;
        document.getElementById("W"+i+"FRange").value=harmFreq;
    }
}

//this function is called when harmonics/free are selected in the said radio buttons group
function SelectHarmonicsOptionRGOnChange() {
    AjustGUIForValidValues();
    //console.log("HarmonicOnChangeHandler: "+document.getElementById("HarmonicSwitch").checked);

    if (document.getElementById("SelectHarmonicsOptionRG").value==2) { //harmonics selected
        adjustValuesForHarmonicsInGUI();

        /*document.getElementById("W2FRange").disabled=true;
        document.getElementById("W2FInput").disabled=true;
        document.getElementById("W3FRange").disabled=true;
        document.getElementById("W3FInput").disabled=true;*/
        for (let i=2; i<=GlobalConstants.numSinusoids; i++) {
            document.getElementById("W"+i+"FInput").disabled=true;
            document.getElementById("W"+i+"FRange").disabled=true;
        }
    
    } else {
/*        document.getElementById("W2FRange").disabled=false;
        document.getElementById("W2FInput").disabled=false;
        document.getElementById("W3FRange").disabled=false;
        document.getElementById("W3FInput").disabled=false;*/
        for (let i=2; i<=GlobalConstants.numSinusoids; i++) {
            document.getElementById("W"+i+"FInput").disabled=false;
            document.getElementById("W"+i+"FRange").disabled=false;
        }

    }
    collectFormDataAndUpdateSignalProcessorValues(); // after all change for harmonics have been made, inform the signal processor, if it exists
}

/*function SelectHarmonicsOptionRGOnChange () {
    console.log(""+document.getElementById("SelectHarmonicsOptionRG").value);
}*/

// called when play sound button is pressed
function playSound(pParsedValues) {

    let totalSampleTime=pParsedValues.Attack+pParsedValues.Decay+pParsedValues.Sustain+pParsedValues.Release;
    //let totalSampleTime=3; // 3 seconds
    if (totalSampleTime<=0) 
        return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // 
    const myArrayBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate*totalSampleTime,
    audioCtx.sampleRate
    );

    // Fill the buffer with sound;
    // just values between -1.0 and 1.0
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
        // This gives us the actual array that contains the data
        const nowBuffering = myArrayBuffer.getChannelData(channel);
        for (let i = 0; i < myArrayBuffer.length; i++) {
            let t=i/audioCtx.sampleRate;
            //let minC1=Math.max(formulaValues.C1, 1);
            //let shiftingRatio=(440/minC1); // adjust the timing to always play a note A
            nowBuffering[i]=getAmplitudeFor(pParsedValues, t); // gets the amplitude [0..1] for the given time t
            nowBuffering[i]*=getWaveScaleFor(pParsedValues, t); // multiplies it for a scale to give the wave the shape according to attack, sustain and release times
        }
    }

    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    const source = audioCtx.createBufferSource();

    // set the buffer in the AudioBufferSourceNode
    source.buffer = myArrayBuffer;

    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(audioCtx.destination);

    // start the source playing
    source.start();
}

//mixes all weighted sinusoids together. returns [0..1]
function getAmplitudeFor (pParsedValues, t) {
    //let freq=440;
    //return Math.sin( (2*Math.PI*freq*t) );

    let acc=0;
    let accWeights=0;
    for (let i=0; i<GlobalConstants.numSinusoids; i++) {
        acc+= pParsedValues.WAmplitudes[i]*Math.sin( (2*Math.PI*pParsedValues.WFreqs[i]*t) ); // we add all sine waves together
        accWeights+=pParsedValues.WAmplitudes[i]; // we add all weights together
    }
    acc/=accWeights; // we divide by all weights
    return acc;
}

// applies the wave shape functions (volume levels) returns [0..1]
function getWaveScaleFor (formulaValues, t) {

    if( (formulaValues.Attack>0)&& ((t>=0)&&(t<=formulaValues.Attack)) ) {
        return (1/formulaValues.Attack)*t;
    }

    if( (formulaValues.Decay>0)&& ((t>=formulaValues.Attack)&&(t<=(formulaValues.Attack+formulaValues.Decay))) ) {
        return ( 1- (((1-formulaValues.SustainVolume)/formulaValues.Decay)*(t-formulaValues.Attack)) );
    }

    if( (formulaValues.Sustain>0)&& ((t>=(formulaValues.Attack+formulaValues.Decay))&&(t<=(formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain))) ) {
        //console.log("sustain");
        return formulaValues.SustainVolume;
    }

    if( (formulaValues.Release>0)&& ((t>=(formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain))&&(t<=(formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain+formulaValues.Release))) ) {
        return ( formulaValues.SustainVolume-((formulaValues.SustainVolume/formulaValues.Release)*(t-formulaValues.Attack-formulaValues.Decay-formulaValues.Sustain)) );
    }

    return 0;
}

// called when download wav button is pressed
function downloadWAV(formulaValues) {

    let totalSampleTime=formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain+formulaValues.Release;
    if (totalSampleTime<=0) 
        return;

    let wav = new wavefile.WaveFile();

    let myInt16Array = new Int16Array(44100*totalSampleTime);
    for (let i=0; i<myInt16Array.length; i++) {

        let t=i/44100;

        let smpl=getAmplitudeFor(formulaValues, t); // gets the amplitude [0..1] for the given time i
        smpl*=getWaveScaleFor(formulaValues, t); // multiplies it for a scale to give the wave the shape according to attack, sustain and release times //ToDo: check this
        smpl=Math.floor(smpl*32766); // convert it to 16 bit signed integers
        myInt16Array[i]=smpl;
    }

    // Create a mono wave file, 44.1 kHz, 16-bit
    wav.fromScratch(1, 44100, '16', myInt16Array);

    // create the file
    var blob = new Blob([wav.toBuffer()], {type: "audio/wav"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = "sound.wav";
    link.download = fileName;
    link.click();
}

async function TestSoundClick() {
    // create the audio worklet and configure it via a message
    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("test-sound-processor.js");
    //
    let testSPNode = new AudioWorkletNode(
    audioContext,
    "test-sound-processor",
    );
    //
    testSPNode.port.onmessage = (e) => console.log("Main app: Received from sound procesor: "+e.data);
    testSPNode.connect(audioContext.destination);

    let myAudioProcessorMessage =new AudioProcessorMessage(retrieveParsedValues(), false, audioContext.sampleRate); // create config message
    testSPNode.port.postMessage(myAudioProcessorMessage); // send configuration message

    //global variables
    GlobalVariables.signalProcessor=testSPNode;
    GlobalVariables.myAudioContext=audioContext; //global var
    GlobalVariables.isSoundTestRunning=true;

}

function StopTestClick(){
    if (GlobalVariables.isSoundTestRunning==false)
        return;

    if ((GlobalVariables.myAudioContext!=null)&&(GlobalVariables.signalProcessor!=null)) {

        let myAudioProcessorMessage =new AudioProcessorMessage(null, true, -1); // create a stop message
    
        GlobalVariables.signalProcessor.port.postMessage(myAudioProcessorMessage); //send the stop message
    
        //clean
        GlobalVariables.myAudioContext.close();
        GlobalVariables.signalProcessor=null;
        GlobalVariables.myAudioContext=null;
        GlobalVariables.isSoundTestRunning=false;
    
        CheckWebMidiClick(); // we re-install midi sound processor
    }        
}

// constains the info sent via message to an audio signal processor
class AudioProcessorMessage {  
    audioTestStopRequested= false; // request audio signal processing to stop
    audioCtxSampleRate= -1;
    parsedValues=null;
 
    constructor(pParsedValues, extirreq, smplerate) { 
        
        if (pParsedValues!=null) {
            //M1
            this.parsedValues=pParsedValues; 
       }
        
        this.audioCtxSampleRate=smplerate;
        this.audioTestStopRequested=extirreq;    
    }  
}

// if a signal processor exists, send all the changes in GUI
function collectFormDataAndUpdateSignalProcessorValues(){
    if (GlobalVariables.isSoundTestRunning==false)
        return;

    if ((GlobalVariables.signalProcessor!=null)&&(GlobalVariables.myAudioContext!=null))
    {   
        let myAudioProcessorMessage =new AudioProcessorMessage(retrieveParsedValues(), false, GlobalVariables.myAudioContext.sampleRate); 
        GlobalVariables.signalProcessor.port.postMessage(myAudioProcessorMessage);// send the new form values to audio processor
    }
}

// constains the info sent via message to a MIDI audio signal processor
class MIDIAudioProcessorMessage {  
    messageType="";
    key=-1;
    parsedValues=null;
    timeShiftingRatio=-1;

    constructor(messageTypep, keyp, pparsedValues, timeShiftingRatiop) { 
        this.messageType=messageTypep;
        this.key=keyp;    

        this.timeShiftingRatio=timeShiftingRatiop;

        if (pparsedValues!=null) {
            this.parsedValues=pparsedValues;
        }
    }  
}

// we can have multiple  keypressed events for the same key (repetition)
/* This function triggers when a keyboard key is pressed, via computer keyboard or midi device
*/
async function keyPressed(keyCode) {
    //console.log("keyPressed :"+keyCode)

    if (GlobalVariables.isSoundTestRunning)
        return;

    if ((GlobalVariables.myAudioContext==null)||(GlobalVariables.signalProcessor==null))
        return;

    //
    let myTimeShiftingRatio=1;
    let mustIPlayThisKey=false;

    // stretch the time T to play the correct note
    switch (keyCode) {
        case 65: //A
            myTimeShiftingRatio=349/440;
            mustIPlayThisKey=true;
            break;
        case 83: //S
            myTimeShiftingRatio=369/440;
            mustIPlayThisKey=true;
            break;
        case 68: //D
            myTimeShiftingRatio=392/440;
            mustIPlayThisKey=true;
            break;
        case 70: //F
            myTimeShiftingRatio=415/440;
            mustIPlayThisKey=true;
            break;
        case 71: //G
            myTimeShiftingRatio=440/440;
            mustIPlayThisKey=true;
            break;
        case 72: //H
            myTimeShiftingRatio=466/440;
            mustIPlayThisKey=true;
            break;
        case 74: //J
            myTimeShiftingRatio=493/440;
            mustIPlayThisKey=true;
            break;
        case 75: //K
            myTimeShiftingRatio=525/440;
            mustIPlayThisKey=true;
            break;
        case 76: //L
            myTimeShiftingRatio=554/440;
            mustIPlayThisKey=true;
            break;
    }

    if (keyCode>1000){ // received from MIDI dev
        myTimeShiftingRatio=midiNoteToFrequency(keyCode-1000)/440; // convert the key received from midi device into frequency
        mustIPlayThisKey=true;
    }

    if (mustIPlayThisKey) {
        let myAudioProcessorMessage =new MIDIAudioProcessorMessage("noteOn", keyCode, retrieveParsedValues(), myTimeShiftingRatio);
        GlobalVariables.signalProcessor.port.postMessage(myAudioProcessorMessage);
    }
}

async function keyReleased(keyCode) {
    //console.log("keyReleased :"+keyCode)    

    if (window.isSoundTestRunning)
        return;

    if ((GlobalVariables.myAudioContext==null)||(GlobalVariables.signalProcessor==null))
        return;

    //
    let myAudioProcessorMessage =new MIDIAudioProcessorMessage("noteOff", keyCode, null, 0);
    GlobalVariables.signalProcessor.port.postMessage(myAudioProcessorMessage);
}

/*
Checks if webmidi is available and configures it, but first, installs the midi sound processor.
*/
async function CheckWebMidiClick() {

    if (window.isSoundTestRunning)
        return;

    if (GlobalVariables.myAudioContext!=null) {
        GlobalVariables.myAudioContext.close();
    }

    //console.log(""+window.signalProcessor.constructor.name);

    // create the audio worklet and configure it via a message
    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("midi-sound-processor.js");
        //
    let midiSPNode = new AudioWorkletNode(
        audioContext,
        "midi-sound-processor",
    );
    //
    midiSPNode.port.onmessage = (e) => console.log("Main app: Received from sound procesor: "+e.data);
    midiSPNode.connect(audioContext.destination);
    
    //global variables
    GlobalVariables.signalProcessor=midiSPNode;
    GlobalVariables.myAudioContext=audioContext; //global var

    // send configuration message
    GlobalVariables.signalProcessor.port.postMessage( {messageType:"config", audioTestStopRequested:false, audioCtxSampleRate: audioContext.sampleRate});

    await navigator.requestMIDIAccess()
    .then(
      (midi) => midiReady(midi),
      (err) => console.log('MIDI: Something went wrong', err));
}

function midiReady(midi) {
    // Also react to device changes.
    midi.addEventListener('statechange', (event) => MIDIinitDevices(event.target));
    MIDIinitDevices(midi); // see the next section!
  }

  function MIDIinitDevices(midi) {
    // Reset.
    let midiIn = [];
    let midiOut = [];
    
    // MIDI devices that send you data.
    const inputs = midi.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
      midiIn.push(input.value);
    }
    
    // MIDI devices that you send data to.
    const outputs = midi.outputs.values();
    for (let output = outputs.next(); output && !output.done; output = outputs.next()) {
      midiOut.push(output.value);
    }
    
    //displayDevices();
    MIDIstartListening(midiIn);
  }
  
  
  // Start listening to MIDI messages.
  function MIDIstartListening(midiIn) {
    for (const input of midiIn) {
      input.addEventListener('midimessage', midiMessageReceived);
    }
  }

  function midiMessageReceived(event) {
    // MIDI commands we care about. See
    // http://webaudio.github.io/web-midi-api/#a-simple-monophonic-sine-wave-midi-synthesizer.
    const NOTE_ON = 9;
    const NOTE_OFF = 8;
  
    const cmd = event.data[0] >> 4;
    const pitch = event.data[1];
    const velocity = (event.data.length > 2) ? event.data[2] : 1;
    
    // You can use the timestamp to figure out the duration of each note.
    //const timestamp = Date.now();
    
    // Note that not all MIDI controllers send a separate NOTE_OFF command for every NOTE_ON.
    if (cmd === NOTE_OFF || (cmd === NOTE_ON && velocity === 0)) {
      //console.log(`from ${event.srcElement.name} note off: pitch:${pitch}, velocity: ${velocity}`);
      /////console.log ("Noteoff: NoteId="+pitch);
      keyReleased(1000+pitch);
    
/*      // Complete the note!
      const note = notesOn.get(pitch);
      if (note) {
        console.log(`🎵 pitch:${pitch}, duration:${timestamp - note} ms.`);
        //notesOn.delete(pitch);
      }*/

    } else if (cmd === NOTE_ON) {
      //console.log(`from ${event.srcElement.name} note on: pitch:${pitch}, velocity: {velocity}`);
      ///////////////console.log ("NoteOn: NoteID= "+pitch+"freq="+midiNoteToFrequency(event.data[1]));
      keyPressed(1000+pitch);
      
      // One note can only be on at once.
      //notesOn.set(pitch, timestamp);
    }
  }

function midiNoteToFrequency (note) {
    return Math.pow(2, ((note - 69) / 12)) * 440;
}
