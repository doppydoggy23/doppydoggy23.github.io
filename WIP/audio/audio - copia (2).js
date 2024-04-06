"use strict";

function initializeUI() {

}

function playNoise() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Create an empty three-second stereo buffer at the sample rate of the AudioContext
    const myArrayBuffer = audioCtx.createBuffer(
    2,
    audioCtx.sampleRate,
    audioCtx.sampleRate
    );

    // Fill the buffer with white noise;
    // just random values between -1.0 and 1.0
    for (let channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
        // This gives us the actual array that contains the data
        const nowBuffering = myArrayBuffer.getChannelData(channel);
        for (let i = 0; i < myArrayBuffer.length; i++) {
            // Math.random() is in [0; 1.0]
            // audio needs to be in [-1.0; 1.0]
            
            //NOISE 
            //nowBuffering[i] = Math.random() * 2 - 1;
            
            // SINUSOIDAL WAVE
            //y(t) = A sin(2πft)
            // nowBuffering[i]=1*Math.sin(2*Math.PI * 440 * (i/myArrayBuffer.length) );

            // FM SYNTHESIS 1
/*            let C=242;
            let D=2;
            let M=40;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M*(i/myArrayBuffer.length)) );
            */

            
            // FM SYNTHESIS 2
/*            let C=75;
            let D=1;
            let M=300;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M*(i/myArrayBuffer.length)) );
*/            


/*
            // modulator P modulates modulator M1
            let CP=10;
            let DP=10;
            let MP=10;

            let M=CP+DP*Math.sin(2*Math.PI*MP*(i/myArrayBuffer.length));

            let C=250;
            let D=50;
            //let M=50;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M*(i/myArrayBuffer.length)) );
*/

/*
            // modulator M1 and M2 modulates C
            let M2=305;
            let D2=10;

            let C=200;
            let D=10;
            let M=303;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M*(i/myArrayBuffer.length)) + D2*Math.sin(2*Math.PI*M2*(i/myArrayBuffer.length)) );
*/
/*            //enseguida se satura y suena ruido
            // Modulator PP modulates modulator P that modulates modulator M1
            let CPP=200;
            let DPP=0.5;
            let PP=200;

            let MPP=CPP+DPP*Math.sin(2*Math.PI*PP*(i/myArrayBuffer.length));

            let CP=100;
            let DP=0.5;
            let MP=MPP;

            let M=CP+DP*Math.sin(2*Math.PI*MP*(i/myArrayBuffer.length));

            let C=50;
            let D=50;
            //let M=50;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M*(i/myArrayBuffer.length)) );
*/

/*
            // Modulator M modulates C1 and C2
            // suena como 2 tonos
            let C1=150;
            let C2=110;
            let D=1;
            let M=300;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C1*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M*(i/myArrayBuffer.length)) );            
            nowBuffering[i]+=A*Math.sin( 2*Math.PI*C2*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M*(i/myArrayBuffer.length)) );
            nowBuffering[i]/=2;
*/            
/*
            // Modulator M2 modulates C1 and M2 modulates C2
            // suena como 2 tonos
            let C1=150;
            let C2=210;
            let D=1;
            let M1=300;
            let M2=100;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C1*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M1*(i/myArrayBuffer.length)) );            
            nowBuffering[i]+=A*Math.sin( 2*Math.PI*C2*(i/myArrayBuffer.length) + D*Math.sin(2*Math.PI*M2*(i/myArrayBuffer.length)) );
            nowBuffering[i]/=2;
*/

/*
            // Modulator PP modulates modulator P that modulates modulator M1 (another formula) works much better
            let CPP=100;
            let DPP=2;
            let PP=100;

            let y1=1*Math.sin( 2*Math.PI*CPP*(i/myArrayBuffer.length) + DPP*Math.sin(2*Math.PI*PP*(i/myArrayBuffer.length)) );

            let CP=100;
            let DP=2;
            let M=100;

            let y2=1*Math.sin( 2*Math.PI*CP*(i/myArrayBuffer.length) + DP*y1 );

            let C=300;
            let D=2;
            //let M=50;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C*(i/myArrayBuffer.length) + D*y2 );
*/

            // Modulators M1 and M2 modulate C1
            let D1=10;
            let D2=0;
            let M1=110;
            let M2=123;

            let C=440;
            //let M=50;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C*(i/myArrayBuffer.length) + D1*Math.sin(2*Math.PI*M1*(i/myArrayBuffer.length)) + D2*Math.sin(2*Math.PI*M2*(i/myArrayBuffer.length)) );

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

function downloadWAV() {

    let wav = new wavefile.WaveFile();

    let myIntArray = new Int32Array(44100);
    for (let i=0; i<myIntArray.length; i++) {
        if (Math.random()>0.5) {
            myIntArray[i]=Math.floor(Math.random()*2000000000);
        }
        else {
            myIntArray[i]=Math.floor(Math.random()*2000000000*-1);
        }
            
    }

    // Create a mono wave file, 44.1 kHz, 32-bit and 4 samples
    //wav.fromScratch(1, 44100, '32', [0, -2147483, 2147483, 4]);
    wav.fromScratch(1, 44100, '32', myIntArray);
    //fs.writeFileSync(path, wav.toBuffer());

    //let myByteArray = new Uint8Array(5);
    //myByteArray= [1, 2, 3, 4, 5];

    var blob = new Blob([wav.toBuffer()], {type: "audio/wav"});
    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    var fileName = "sound.wav";
    link.download = fileName;
    link.click();
}

function playSound() {
    let formulaValues=checkForValidValues();
    //document.getElementById("docfooter").innerHTML="dfsdf";

    if ((formulaValues.Algorithm!="Algorithm1")&&(formulaValues.Algorithm!="Algorithm2")&&(formulaValues.Algorithm!="Algorithm3"))
        throw "Unsupported Algorithm playSound()";

    let totalSampleTime=formulaValues.Attack+formulaValues.Sustain+formulaValues.Release;
    if (totalSampleTime<=0) 
        return;

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Create an empty three-second stereo buffer at the sample rate of the AudioContext
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

            if (formulaValues.Algorithm=="Algorithm1")  {
                // Modulator M1 modulates C1
                nowBuffering[i]=formulaValues.A1*Math.sin( 2*Math.PI*formulaValues.C1*(i/audioCtx.sampleRate + formulaValues.D1*Math.sin(2*Math.PI*formulaValues.M1*(i/audioCtx.sampleRate))) );
                }

            if (formulaValues.Algorithm=="Algorithm2")  {
                // Modulator M2 modulates modulator M1 that modulates C1    
                let M1Freq=formulaValues.M1+(formulaValues.D2*Math.sin(2*Math.PI*formulaValues.M2*(i/audioCtx.sampleRate)));
                nowBuffering[i]=formulaValues.A1*Math.sin( 2*Math.PI*formulaValues.C1*(i/audioCtx.sampleRate + formulaValues.D1*Math.sin(2*Math.PI*M1Freq*(i/audioCtx.sampleRate))) );
            }

            if (formulaValues.Algorithm=="Algorithm3")  {
                // Modulator M3 modulates modulator M2 that modulates modulator M1 that modulates C1    
                let M2Freq=formulaValues.M2+(formulaValues.D3*Math.sin(2*Math.PI*formulaValues.M3*(i/audioCtx.sampleRate)));
                let M1Freq=formulaValues.M1+(formulaValues.D2*Math.sin(2*Math.PI*M2Freq*(i/audioCtx.sampleRate)));
                nowBuffering[i]=formulaValues.A1*Math.sin( 2*Math.PI*formulaValues.C1*(i/audioCtx.sampleRate + formulaValues.D1*Math.sin(2*Math.PI*M1Freq*(i/audioCtx.sampleRate))) );
            }
    
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

/*
Checks that all form values are correct, and if not, corrects them
*/
function checkForValidValues() {
    const M1Min=0;
    const M1Max=5000;
    const M1Default=100;

    const A1Min=0;
    const A1Default=1;
    const A1Max=1;

    const C1Min=0;
    const C1Default=100;
    const C1Max=5000;

    const D1Min=0;
    const D1Default=1;
    const D1Max=1000;

    //M1 Values
    let M1Value=parseInt(document.getElementById("M1").value);
    if (isNaN(M1Value)) {
        document.getElementById("M1").value=""+M1Default;
        M1Value=M1Default;
    }
    if (M1Value<M1Min) {
        document.getElementById("M1").value=""+M1Min;
        M1Value=M1Min;
    }
    if (M1Value>M1Max) {
        document.getElementById("M1").value=""+M1Max;
        M1Value=M1Max;
    }

    //A1 Values
    let A1Value=parseFloat(document.getElementById("A1").value);

    //C1 Values
    let C1Value=parseInt(document.getElementById("C1").value);
    if (isNaN(C1Value)) {
        document.getElementById("C1").value=""+C1Default;
        C1Value=C1Default;
    }
    if (C1Value<C1Min) {
        document.getElementById("C1").value=""+C1Min;
        C1Value=C1Min;
    }
    if (C1Value>C1Max) {
        document.getElementById("C1").value=""+C1Max;
        C1Value=C1Max;
    }

    //D1 Values
    let D1Value=parseFloat(document.getElementById("D1").value);
    if (isNaN(D1Value)) {
        document.getElementById("D1").value=""+D1Default;
        D1Value=D1Default;
    }
    if (D1Value<D1Min) {
        document.getElementById("D1").value=""+D1Min;
        D1Value=D1Min;
    }
    if (D1Value>D1Max) {
        document.getElementById("D1").value=""+D1Max;
        D1Value=D1Max;
    }

    //D2 Values
    let D2Value=parseFloat(document.getElementById("D2").value);
    if (isNaN(D2Value)) {
        document.getElementById("D2").value=""+D1Default;
        D2Value=D1Default;
    }
    if (D2Value<D1Min) {
        document.getElementById("D2").value=""+D1Min;
        D2Value=D1Min;
    }
    if (D2Value>D1Max) {
        document.getElementById("D2").value=""+D1Max;
        D2Value=D1Max;
    }

    //M2 Values
    let M2Value=parseInt(document.getElementById("M2").value);
    if (isNaN(M2Value)) {
        document.getElementById("M2").value=""+M1Default;
        M2Value=M1Default;
    }
    if (M2Value<M1Min) {
        document.getElementById("M2").value=""+M1Min;
        M2Value=M1Min;
    }
    if (M2Value>M1Max) {
        document.getElementById("M2").value=""+M1Max;
        M2Value=M1Max;
    }

    //D3 Values
    let D3Value=parseFloat(document.getElementById("D3").value);
    if (isNaN(D3Value)) {
        document.getElementById("D3").value=""+D1Default;
        D3Value=D1Default;
    }
    if (D3Value<D1Min) {
        document.getElementById("D3").value=""+D1Min;
        D3Value=D1Min;
    }
    if (D3Value>D1Max) {
        document.getElementById("D3").value=""+D1Max;
        D3Value=D1Max;
    }

    //M3 Values
    let M3Value=parseInt(document.getElementById("M3").value);
    if (isNaN(M3Value)) {
        document.getElementById("M3").value=""+M1Default;
        M3Value=M1Default;
    }
    if (M3Value<M1Min) {
        document.getElementById("M3").value=""+M1Min;
        M3Value=M1Min;
    }
    if (M3Value>M1Max) {
        document.getElementById("M3").value=""+M1Max;
        M3Value=M1Max;
    }


    //Attack, sustain and release
    let attackValue=parseFloat(document.getElementById("AttackSlider").value);
    let sustainValue=parseFloat(document.getElementById("SustainSlider").value);
    let releaseValue=parseFloat(document.getElementById("ReleaseSlider").value);

        
    console.log ("M1="+M1Value+" A1="+A1Value+" C1="+C1Value+" D1="+D1Value+ " Attack="+attackValue+ " Sustain="+sustainValue+" Release="+releaseValue);
    console.log ("M2="+M2Value+" D2="+D2Value);
    console.log ("M3="+M3Value+" D3="+D3Value);

    let selectedAlgorithm=document.getElementById("Algorithm").value;
    if (selectedAlgorithm=="Algorithm1") {
        return {
            Algorithm:"Algorithm1", 
            M1: M1Value, 
            A1: A1Value, 
            C1: C1Value, 
            D1: D1Value,
            Attack:attackValue,
            Sustain: sustainValue,
            Release: releaseValue
        };
    }

    if (selectedAlgorithm=="Algorithm2") {
        return {
            Algorithm:"Algorithm2", 
            M1: M1Value, 
            A1: A1Value, 
            C1: C1Value, 
            D1: D1Value,
            M2: M2Value,
            D2: D2Value,
            Attack:attackValue,
            Sustain: sustainValue,
            Release: releaseValue
        };
    }

    if (selectedAlgorithm=="Algorithm3") {
        return {
            Algorithm:"Algorithm3", 
            M1: M1Value, 
            A1: A1Value, 
            C1: C1Value, 
            D1: D1Value,
            M2: M2Value,
            D2: D2Value,
            M3: M3Value,
            D3: D3Value,
            Attack:attackValue,
            Sustain: sustainValue,
            Release: releaseValue
        };
    }
    throw Error("Algorithm not supported checkForValidValues()");
}

function AlgorithmListChange() {
    let selectedAlgorithm=document.getElementById("Algorithm").value;
    if (selectedAlgorithm=="Algorithm1") { //M1-C1
        document.getElementById("Modulator2Table").style.display = "none";
        document.getElementById("Modulator3Table").style.display = "none";
        document.getElementById("algopicdiv").innerHTML='<img src="algorithm1.png" alt="Algorithm 1" style="width:10%;height:10%;">';
    }
    if (selectedAlgorithm=="Algorithm2") { //M2-M1-C1
        document.getElementById("Modulator3Table").style.display = "none";
        document.getElementById("Modulator2Table").style.display = "initial";
        document.getElementById("algopicdiv").innerHTML='<img src="algorithm2.png" alt="Algorithm 2" style="width:10%;height:10%;">';
    }
    if (selectedAlgorithm=="Algorithm3") { // M3-M2-M1-C1
        document.getElementById("Modulator2Table").style.display = "initial";
        document.getElementById("Modulator3Table").style.display = "initial";
        document.getElementById("algopicdiv").innerHTML='<img src="algorithm3.png" alt="Algorithm 3" style="width:10%;height:10%;">';
    }

}