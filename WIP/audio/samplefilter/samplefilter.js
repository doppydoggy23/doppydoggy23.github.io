"use strict";

let Globals = {
    numInstruments: 5,
    musicPattern: null, // array that holds the music pattern
    maxMusicPatternLength: 25, // should match or be larger than <sl-range> PatternLengthRange
    internalTimerFPS: 10, // max value of internalFrames. Should be equal than <SpeedRange> max
    //
    currentColumn: 0,
    isPlaying: false,
    timerID: null,
    internalFrames: 0, // counter that counts how many ticks before playing the next note
};

function initializeUI() {

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
    let wav = new wavefile.WaveFile();//WaveFile();
    wav.fromBuffer(new Uint8Array(myArrayBuffer));

    document.getElementById('textresultparagraph').innerText=" sampleRate="+wav.fmt.sampleRate
        + " numChannels="+wav.fmt.numChannels + " bitsPerSample="+wav.fmt.bitsPerSample;
}

function PlayButtonClick (){
    // must be a power of 2.
    let signal = [1, -1, 1, -1];

    let phasors = fft(signal);
    
    console.log("phasors: real " + phasors.real + " imag " + phasors.imag);

    let reconstructedSignal = ifft(phasors);

    console.log("reconstructed signal: " + reconstructedSignal.real);

}

function LoadWAVButtonClick(){
    document.getElementById('file-selector').click();
}