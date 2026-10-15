//ToDo: fix sliders ranges (display limits values) and sizes
//ToDo: add play button


"use strict";

/*
This code belongs to pubic domain (2026)
*/

let GlobalVariables = {
    signalProcessor: null,
    myAudioContext:null,
    isSoundTestRunning:false
}

function initializeUI() {

}


async function PlayContinuouslyClick() {
    if (GlobalVariables.isSoundTestRunning)
        return;

    // create the audio worklet and configure it via a message
    const audioContext = new AudioContext();
    await audioContext.audioWorklet.addModule("continuoussp.js");
    //
    let testSPNode = new AudioWorkletNode(
    audioContext,
    "continuoussp",
    );
    //
    testSPNode.port.onmessage = (e) => console.log("Main app: Received from sound procesor: "+e.data);
    testSPNode.connect(audioContext.destination);

    const minslider = document.getElementById('MinFreqSlider');
    const maxslider = document.getElementById('MaxFreqSlider');
    let myAudioProcessorMessage =new PCAudioProcessorMessage({MinFreq: minslider.value, MaxFreq: maxslider.value}, false, audioContext.sampleRate); // create config message
    testSPNode.port.postMessage(myAudioProcessorMessage); // send configuration message

    //global variables
    GlobalVariables.signalProcessor=testSPNode;
    GlobalVariables.myAudioContext=audioContext; //global var
    GlobalVariables.isSoundTestRunning=true;
}

function StopPlayContinuouslyClick(){
    if (GlobalVariables.isSoundTestRunning==false)
        return;

    if ((GlobalVariables.myAudioContext!=null)&&(GlobalVariables.signalProcessor!=null)) {

        let myAudioProcessorMessage =new PCAudioProcessorMessage(null, true, -1); // create a stop message
    
        GlobalVariables.signalProcessor.port.postMessage(myAudioProcessorMessage); //send the stop message
    
        //clean
        GlobalVariables.myAudioContext.close();
        GlobalVariables.signalProcessor=null;
        GlobalVariables.myAudioContext=null;
        GlobalVariables.isSoundTestRunning=false;    
    }        
}

// constains the info sent via message to an audio signal processor
class PCAudioProcessorMessage {  
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

function MinFreqSliderInput(){
    const minslider = document.getElementById('MinFreqSlider');
    const maxslider = document.getElementById('MaxFreqSlider');
    //console.log ("MinFreqSlider.value="+ slider.value)

    if (GlobalVariables.isSoundTestRunning)
        GlobalVariables.signalProcessor.port.postMessage(new PCAudioProcessorMessage( {MinFreq: minslider.value, MaxFreq: maxslider.value}, false, GlobalVariables.myAudioContext.sampleRate));
}

function MaxFreqSliderInput(){
    const minslider = document.getElementById('MinFreqSlider');
    const maxslider = document.getElementById('MaxFreqSlider');
    //console.log ("MaxFreqSlider.value="+ slider.value)

    if (GlobalVariables.isSoundTestRunning)
        GlobalVariables.signalProcessor.port.postMessage(new PCAudioProcessorMessage( {MinFreq: minslider.value, MaxFreq: maxslider.value}, false, GlobalVariables.myAudioContext.sampleRate));
}
