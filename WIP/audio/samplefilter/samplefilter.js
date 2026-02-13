"use strict";

const FFTLength=4096;

let WAVInfo ={ 
//    sampleRate
//    numChannels
//    samples (in mono)
//    processedSamples
};


function initializeUI() {
    WAVInfo=null;
}

/*
 * This function is called when the user clicks a new file to be read in memory
 */
function readFile(input) {
    let file = input.files[0];

/*    let textInfo="File name: "+file.name;

    document.getElementById('textresultparagraph').innerText=textInfo;

*/  
    let reader = new FileReader();

/*    reader.readAsText(file);
    reader.onload = function() {
        console.log(reader.result);
    };*/

    reader.readAsArrayBuffer(file);
    reader.onload = function() {
        //console.log(reader.result);
        let myArrayBuffer=reader.result;
        newFileReadInMemory(file.name, myArrayBuffer);
    };
}

/*
 *  This function is called when the new file is already in memory. Ready to be manipulated
*/
function newFileReadInMemory (filename, myArrayBuffer){
    
    let wav;

    try {
        wav = new wavefile.WaveFile();//WaveFile();
    
        wav.fromBuffer(new Uint8Array(myArrayBuffer));

        WAVInfo={};
        WAVInfo.sampleRate=wav.fmt.sampleRate;
        WAVInfo.numChannels=wav.fmt.numChannels;
        WAVInfo.bitsPerSample=wav.fmt.bitsPerSample;
        //console.log ("wav.data.samples[1000]="+wav.data.samples[1000]);

        let mySamples = wav.getSamples(true);
        //console.log ("mySamples.length="+mySamples.length);
        //console.log ("mySamples[1000]="+mySamples[1000]);
        //console.log ("mySamples[1001]="+mySamples[1001]);

        //TODO: TRY 16 bit mono

        let myRange=128;
        if (wav.fmt.bitsPerSample==16)
            myRange=32768;
        if (wav.fmt.bitsPerSample>16)
            throw "more than 16 bits are not supported";

        WAVInfo.samples=new Float64Array(mySamples.length/wav.fmt.numChannels);
        if (wav.fmt.numChannels <= 1) {
            for (let i =0; i<mySamples.length; i++) {
                WAVInfo.samples[i]=mySamples[i];
                if (wav.fmt.bitsPerSample==8)
                    WAVInfo.samples[i]-=128;
                WAVInfo.samples[i]/=myRange;
            }
        } else {
            let ii=0;
            for (let i =0; i<mySamples.length; i+=2) {
                if (WAVInfo.bitsPerSample==8) {
                    WAVInfo.samples[ii]=mySamples[i];
                    WAVInfo.samples[ii]+=mySamples[i+1];
                    WAVInfo.samples[ii]/=2;
                    WAVInfo.samples[ii]-=128;
                    WAVInfo.samples[ii]/=myRange;
                    ii++;    
                }
                if (WAVInfo.bitsPerSample==16) {
                    WAVInfo.samples[ii]=mySamples[i];
                    WAVInfo.samples[ii]=mySamples[i+1];
                    WAVInfo.samples[ii]/=2;
                    WAVInfo.samples[ii]/=myRange;
                    ii++;    
                }
            }
        }        

    } catch (e) {
        document.getElementById('textresultparagraph').innerText="file format not supported";
    }

    document.getElementById('textresultparagraph').innerText=" sampleRate="+wav.fmt.sampleRate
            + " numChannels="+wav.fmt.numChannels + " bitsPerSample="+wav.fmt.bitsPerSample;
}

function PlayButtonClick (){
/*    // must be a power of 2.
    let signal = [1, -1, 1, -1];

    let phasors = fft(signal);
    
    console.log("phasors: real " + phasors.real + " imag " + phasors.imag);

    let reconstructedSignal = ifft(phasors);

    console.log("reconstructed signal: " + reconstructedSignal.real);
*/
    playWAV();
}

function PlayProcessedButtonClick() {
    if (WAVInfo==null)
        return;

    processWAVSamples();
    playProcessedWAV();
}

function LoadWAVButtonClick(){
    document.getElementById('file-selector').click();
}

// called when play sound button is pressed
function playWAV() {

    if (WAVInfo==null)
        return;

    let totalSampleTime=WAVInfo.samples.length/WAVInfo.sampleRate;
    if (totalSampleTime<=0)
        return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // 
    const myArrayBuffer = audioCtx.createBuffer(
    2,
    WAVInfo.sampleRate*totalSampleTime,
    WAVInfo.sampleRate
    );

    // Fill the buffer with sound;
    // just values between -1.0 and 1.0
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
        // This gives us the actual array that contains the data
        const nowBuffering = myArrayBuffer.getChannelData(channel);
        for (let i = 0; i < myArrayBuffer.length; i++) {
            nowBuffering[i]=WAVInfo.samples[i];
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


//processes the original WAV samples to get the new processed samples
function processWAVSamples() {

    let numFFTBufs=Math.ceil(WAVInfo.samples.length/FFTLength)
    WAVInfo.processedSamples=new Float64Array(numFFTBufs*FFTLength);

    let signalBuffer=new Float64Array(FFTLength);
    
    //clear the samples (useless)
    for (let i=0; i<WAVInfo.processedSamples.length; i++)
        WAVInfo.processedSamples[i]=0;

    //for every buffer
    for (let iBuf=0; iBuf<numFFTBufs; iBuf++) {

        let bufNumIndex=(iBuf*FFTLength);

        //process every FFT buffer
        for (let i=0; i<FFTLength; i++) {

            let origIndex=bufNumIndex+i;
            let value;

            if (origIndex < WAVInfo.samples.length)
                value=WAVInfo.samples[origIndex];
            else
                value=0;
            
            signalBuffer[i]=value;
        }

        let phasors = fft(signalBuffer);
        //console.log("phasors: real " + phasors.real + " imag " + phasors.imag);

        // DEBUG
        for (let i=50; i<phasors.real.length; i++) {
            phasors.real[i]=0;
            phasors.imag[i]=0;
        }
        // DEBUG

        let reconstructedSignal = ifft(phasors);
        //console.log("reconstructed signal: " + reconstructedSignal.real);
    
        //copy the buffer to the modified samples array
        for (let i=0; i<FFTLength; i++) {
            WAVInfo.processedSamples[bufNumIndex+i]=reconstructedSignal.real[i];
        }
        /*for (let i=0; i<FFTLength; i++) {
            WAVInfo.processedSamples[bufNumIndex+i]=signalBuffer[i];
        }*/
    }
}

// plays the processed wav
function playProcessedWAV() {

    if (WAVInfo==null)
        return;

    let totalSampleTime=WAVInfo.processedSamples.length/WAVInfo.sampleRate;
    if (totalSampleTime<=0)
        return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // 
    const myArrayBuffer = audioCtx.createBuffer(
    2,
    WAVInfo.sampleRate*totalSampleTime,
    WAVInfo.sampleRate
    );

    // Fill the buffer with sound;
    // just values between -1.0 and 1.0
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
        // This gives us the actual array that contains the data
        const nowBuffering = myArrayBuffer.getChannelData(channel);
        for (let i = 0; i < myArrayBuffer.length; i++) {
            nowBuffering[i]=WAVInfo.processedSamples[i];
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
