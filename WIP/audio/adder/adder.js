"use strict";

/*
This code belongs to pubic domain (2024)
*/

const GlobalConstants = {
    MaxWaveFrequency: 5000,
    MinWaveFrequency: 0,
    DefaultWaveFrequency: 440,
    numSinusoids: 3, // important. It says how many sinusoids (waves) we have to work with
}

function initializeUI() {

/*    document.getElementById("HarmonicSwitch").addEventListener('sl-change', event => {
        HarmonicOnChangeHandler();
      });*/

    document.getElementById("W1FInput").addEventListener('sl-change', event => {
        W1FrequencyTextOnChange();
    })
    document.getElementById("W2FInput").addEventListener('sl-change', event => {
        W2FrequencyTextOnChange();
    })
    document.getElementById("W3FInput").addEventListener('sl-change', event => {
        W3FrequencyTextOnChange();
    })

}

// This function adjust the values of the GUI elements to make sure they are valid and within range
function AjustGUIForValidValues () {
    //Sinusoid 1
/*    let value=parseInt(document.getElementById("W1FInput").value);
    if (isNaN(value)) {
        document.getElementById("W1FInput").value=""+GlobalConstants.DefaultWaveFrequency;
    }
    if (value<GlobalConstants.MinWaveFrequency) {
        document.getElementById("W1FInput").value=""+GlobalConstants.MinWaveFrequency;
    }
    if (value>GlobalConstants.MaxWaveFrequency) {
        document.getElementById("W1FInput").value=""+GlobalConstants.MaxWaveFrequency;
    }
    
    //Sinusoid 2
    value=parseInt(document.getElementById("W2FInput").value);
    if (isNaN(value)) {
        document.getElementById("W2FInput").value=""+GlobalConstants.DefaultWaveFrequency;
    }
    if (value<GlobalConstants.MinWaveFrequency) {
        document.getElementById("W2FInput").value=""+GlobalConstants.MinWaveFrequency;
    }
    if (value>GlobalConstants.MaxWaveFrequency) {
        document.getElementById("W2FInput").value=""+GlobalConstants.MaxWaveFrequency;
    }
    
    //Sinusoid 3
    value=parseInt(document.getElementById("W3FInput").value);
    if (isNaN(value)) {
        document.getElementById("W3FInput").value=""+GlobalConstants.DefaultWaveFrequency;
    }
    if (value<GlobalConstants.MinWaveFrequency) {
        document.getElementById("W3FInput").value=""+GlobalConstants.MinWaveFrequency;
    }
    if (value>GlobalConstants.MaxWaveFrequency) {
        document.getElementById("W3FInput").value=""+GlobalConstants.MaxWaveFrequency;
    }
*/ 

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
}

function W2FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
    document.getElementById("W2FInput").value=document.getElementById("W2FRange").value;
}

function W3FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
    document.getElementById("W3FInput").value=document.getElementById("W3FRange").value;
}

function W1FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W1FRange").value=document.getElementById("W1FInput").value;
    if (document.getElementById("SelectHarmonicsOptionRG").value==2) {
        adjustValuesForHarmonicsInGUI();
    }
}

function W2FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W2FRange").value=document.getElementById("W2FInput").value;
}

function W3FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W3FRange").value=document.getElementById("W3FInput").value;
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

    //return {W1F, W2F, W3F};
    return {WFreqs, WAmplitudes};
}

function PlayButtonClick() {
    //console.log (retrieveParsedValues());
    playSound(retrieveParsedValues());
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
}

/*function SelectHarmonicsOptionRGOnChange () {
    console.log(""+document.getElementById("SelectHarmonicsOptionRG").value);
}*/

// called when play sound button is pressed
function playSound(pParsedValues) {

    //let totalSampleTime=formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain+formulaValues.Release;
    let totalSampleTime=3; // 3 seconds
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
            //nowBuffering[i]*=getWaveScaleFor(formulaValues, t); // multiplies it for a scale to give the wave the shape according to attack, sustain and release times
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

//mixes all weighted sinusoids together
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