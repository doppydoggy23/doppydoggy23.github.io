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
            nowBuffering[i]=getSelectedWaveAmplitude(t); // gets the amplitude [0..1] for the given time t
            //nowBuffering[i]*=getWaveScaleFor(formulaValues, t); // multiplies it for a scale to give the wave the shape according to attack, sustain and release times
        }
        //
        let processedSample=processSample50WH(nowBuffering, loFreq, hiFreq, fftSize, audioCtx.sampleRate);
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



function getSelectedWaveAmplitude(t){
    return getTriangleWaveAmplitudeFor(t);
  }

  //generate a square wave
function getSquareWaveAmplitudeFor (t) {
    let freq=440;
    let v=Math.sin( (2*Math.PI*freq*t) );
    let squarewave=1;
    if (v<0)
      squarewave=-1;
    return squarewave;
  }

  //generate a triangle wave
function getTriangleWaveAmplitudeFor (t) {
    let freq=440;
    let A=1; // amplitude
    let P=1/freq; // period
    let Tx=((4*A/P)*Math.abs( ((t-(P/4)) % P)- (P/2) )) - A;
    return Tx;
  }

  //generate a sine wave
function getSineWaveAmplitudeFor (t) {
    let freq=440;
    let v=Math.sin( (2*Math.PI*freq*t) );
    return v;
  }

//Windowing function (n=sample index, N=numSamples)
function Hann(n, N) {
    return (0.5-( 0.5*Math.cos((2*Math.PI*n)/N) ));
}

// process sample with 50% hanning window overlap
function processSample50WH(sample, loFreq, hiFreq, fftSize, sampleRate) {
    let bufferFFT=new Float64Array(fftSize); // 
    let pastBuffer=new Float64Array(fftSize/2); // the amount of overlapping window signal
    let result=new Float64Array(sample.length);
    let pos=0; // initial position of window
    bufferFFT.fill(0);
    pastBuffer.fill(0);
    result.fill(0);

    let bandPassFreq1=loFreq;
    let bandPassFreq2=hiFreq;
    if (bandPassFreq1>bandPassFreq2) {
        let temp=bandPassFreq1;
        bandPassFreq1=bandPassFreq2;
        bandPassFreq2=temp;
    }

    while (pos < sample.length) {

        // copy the block to the fft buffer
        for (let i=0; i<fftSize; i++)
            bufferFFT[i]=getSample(sample, pos+i)*Hann(i, fftSize); 

        //perform the FFT
        let phasors = fft(bufferFFT);
        // perform the bandpass filter
        //
        // first we clear the upper part of the FFT
        for (let i=(phasors.real.length/2)+1; i<phasors.real.length; i++) {
            phasors.real[i]=0;
            phasors.imag[i]=0;
        }
        // we cut all the frequencies except between bandPassFreq1 and bandPassFreq2
        // The frequency of the kth bin is given by, k × (sampling_rate / N)
        for (let i=0; i<=(phasors.real.length/2); i++) {
            let thisBinFreq=i*sampleRate/fftSize;
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
        // reconstruct the signal
        let reconstructedSignal = ifft(phasors);
        
        //copy the first half of reconstructedSignal to result
        // after having averaged with the first half of pastBuffer
        for (let i=0; i<(fftSize/2); i++) {
            let val=(reconstructedSignal.real[i]+pastBuffer[i])/2;
            setSample(result, pos+i, val);
        }

        // copy the last half of the reconstructed signal to the pastBuffer
        let ri=0;
        for (let i=(fftSize/2); i<fftSize; i++) {
            pastBuffer[ri]=reconstructedSignal.real[i]; // ToDo: missing hanning weighting
            ri++;
        }

        pos += (fftSize/2);
    }//while

    return result;
}

// helper functions. They check for array boundaries before trying to access array buffers
function getSample(buffervar, pos){
    if ((pos >=0) && (pos < buffervar.length))
        return buffervar[pos];
    else
        return 0;
}
function setSample(buffervar, pos, val){
    if ((pos >=0) && (pos < buffervar.length))
        buffervar[pos]=val;
}
