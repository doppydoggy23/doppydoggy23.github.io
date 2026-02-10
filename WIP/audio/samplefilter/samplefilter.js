"use strict";

/*let Globals = {
    numInstruments: 5,
    musicPattern: null, // array that holds the music pattern
    maxMusicPatternLength: 25, // should match or be larger than <sl-range> PatternLengthRange
    internalTimerFPS: 10, // max value of internalFrames. Should be equal than <SpeedRange> max
    //
    currentColumn: 0,
    isPlaying: false,
    timerID: null,
    internalFrames: 0, // counter that counts how many ticks before playing the next note
};*/

let WAVInfo ={ 
//    sampleRate
//    numChannels
//    samples (in mono)
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

/*    document.getElementById('textresultparagraph').innerText="File name: "+filename;

    let fileBytes=new Uint8Array(myArrayBuffer); // convert it to bytes
    let mytext=" File Bytes=";
    for (let i=0; i<fileBytes.length; i++)
        mytext+=" "+fileBytes[i];

    document.getElementById('textresultparagraph').innerText+=mytext;
*/


    try {
        let wav = new wavefile.WaveFile();//WaveFile();
        wav.fromBuffer(new Uint8Array(myArrayBuffer));

        document.getElementById('textresultparagraph').innerText=" sampleRate="+wav.fmt.sampleRate
            + " numChannels="+wav.fmt.numChannels + " bitsPerSample="+wav.fmt.bitsPerSample;

/*        let samples = new Float64Array(wav.data.samples.length); // wav.getSamples(true, Float64Array);
        for (let i=0; i<wav.data.samples.length; i++)
            samples[i]=wav.data.samples[i]/255;
        //wav.toBitDepth("24");
*/

        //wav.toBitDepth("64");

        WAVInfo={};
        WAVInfo.sampleRate=wav.fmt.sampleRate;
        WAVInfo.numChannels=wav.fmt.numChannels;
        WAVInfo.bitsPerSample=wav.fmt.bitsPerSample;
        //WAVInfo.samples=samples;
        //console.log ("samples.length="+WAVInfo.samples.length);
//        console.log ("samples[1000]="+samples[1000]);
        console.log ("wav.data.samples[1000]="+wav.data.samples[1000]);


/*        if (wav.fmt.numChannels <= 1) {
            for (let i =0; i<samples.length; i++)
                WAVInfo.samples[i]=samples[i];
        } else {
            let ii=0;
            for (let i =0; i<samples.length; i+=2)
                WAVInfo.samples[ii]=(samples[i]+samples[i+1])/2;
                ii++;
        }        
*/
        let mySamples = wav.getSamples(true);
        console.log ("mySamples.length="+mySamples.length);
        console.log ("mySamples[1000]="+mySamples[1000]);
        //console.log ("mySamples="+mySamples);

    } catch (e) {
        document.getElementById('textresultparagraph').innerText="file format not supported";
    }

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
