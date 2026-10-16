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

function PlayOnceClick(){
    playSound();
}

// called when play sound button is pressed
function playSound() {
/*    let totalSampleTime=formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain+formulaValues.Release;
    if (totalSampleTime<=0) 
        return;*/
    let totalSampleTime=3; // 3 seconds

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const myArrayBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate*totalSampleTime,
    audioCtx.sampleRate
    );


    const minslider = document.getElementById('MinFreqSlider').value;
    const maxslider = document.getElementById('MaxFreqSlider').value;
    let loFreq=(audioCtx.sampleRate/2)*minslider/100;
    let hiFreq=(audioCtx.sampleRate/2)*maxslider/100;
    let fftSize=4096;

    // Fill the buffer with sound;
    // just values between -1.0 and 1.0
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
        // This gives us the actual array that contains the data
        const nowBuffering = myArrayBuffer.getChannelData(channel);
        for (let i = 0; i < myArrayBuffer.length; i++) {
            let t=i/audioCtx.sampleRate;
            nowBuffering[i]=getAmplitudeFor(t); // gets the amplitude [0..1] for the given time t
            //nowBuffering[i]*=getWaveScaleFor(formulaValues, t); // multiplies it for a scale to give the wave the shape according to attack, sustain and release times
        }
        //
        let processedSample=processSample(nowBuffering, loFreq, hiFreq, fftSize, audioCtx.sampleRate);
        //
        for (let i = 0; i < myArrayBuffer.length; i++) {
            let t=i/audioCtx.sampleRate;
            nowBuffering[i]=processedSample[i];
        }
    }

    const source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(audioCtx.destination);
    source.start();
}

//generate a square wave
function getAmplitudeFor (t) {
        let freq=440;
        let v=Math.sin( (2*Math.PI*freq*t) );
        let squarewave=1;
        if (v<0)
          squarewave=-1;
        return squarewave;
}

// process a sample removing all below lowfreq and above hifreq
// it uses a 75% window overlap to be able to use Hann windowing function if needed
function processSample(sample, loFreq, hiFreq, fftSize, sampleRate) {

    let bandPassFreq1=loFreq;
    let bandPassFreq2=hiFreq;
    if (bandPassFreq1>bandPassFreq2) {
        let temp=bandPassFreq1;
        bandPassFreq1=bandPassFreq2;
        bandPassFreq2=temp;
    }
    let FFTLength=fftSize;
    
    let processedSample=new Float64Array(sample.length);
    //clear the samples (useless)
    for (let i=0; i<sample.length; i++)
        processedSample[i]=0;

    let bufferFFT=new Float64Array(FFTLength); // signal to be processed
    let pos=-(FFTLength/4); // 75% window overlap

    while (pos < sample.length) {
        for (let i=0; i<FFTLength; i++) {
            let value;

            if ((pos<0)||(pos>=sample.length))
                value=0;
            else
                value=sample[pos+i];

            bufferFFT[i]=value;//*Hann(i, FFTLength);            
        }

        let phasors = fft(bufferFFT);
        //console.log("phasors: real " + phasors.real + " imag " + phasors.imag);

        //
        // first we clear the upper part of the FFT
        for (let i=(phasors.real.length/2)+1; i<phasors.real.length; i++) {
            phasors.real[i]=0;
            phasors.imag[i]=0;
        }
        // we cut all the frequencies except between bandPassFreq1 and bandPassFreq2
        // The frequency of the kth bin is given by, k × (sampling_rate / N)
        for (let i=0; i<=(phasors.real.length/2); i++) {
            let thisBinFreq=i*sampleRate/FFTLength;
            if ((thisBinFreq<bandPassFreq1) || (thisBinFreq>bandPassFreq2)) {
                phasors.real[i]=0;
                phasors.imag[i]=0;
            }
        }
        // after that, we need to double the remaining coeficients in the
        // left half to compensate for the loss of energy
        for (let i=0; i<=(phasors.real.length/2); i++) {
            phasors.real[i]*=2;
            phasors.imag[i]*=2;
        }
        //


        // DEBUG
        let reconstructedSignal = ifft(phasors);

        let dest=pos+(FFTLength/2)-(FFTLength/8); // past 2/3 of the start of the chunk

        for (let i=0; i<(FFTLength/4); i++)
            if ( ((dest+i)>=0) && ((dest+i)<processedSample.length) )
                processedSample[dest+i]=reconstructedSignal.real[(FFTLength/2)-(FFTLength/8)+i];
        
        pos+=(FFTLength/4); // 75% window overlap
    }
    
    return processedSample;
}

//Windowing function (n=sample index, N=numSamples)
function Hann(n, N) {
    return (0.5-( 0.5*Math.cos((2*Math.PI*n)/N) ));
}