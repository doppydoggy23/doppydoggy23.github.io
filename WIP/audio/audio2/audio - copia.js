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


            // Modulator PP modulates modulator P that modulates modulator M1 (another formula) works much better
            let CPP=150;
            let DPP=1;
            let PP=150;

            let y1=1*Math.sin( 2*Math.PI*CPP*(i/myArrayBuffer.length) + DPP*Math.sin(2*Math.PI*PP*(i/myArrayBuffer.length)) );

            let CP=150;
            let DP=1;
            let M=150;

            let y2=1*Math.sin( 2*Math.PI*CP*(i/myArrayBuffer.length) + DP*y1 );

            let C=150;
            let D=1;
            //let M=50;
            let A=1;
            nowBuffering[i]=A*Math.sin( 2*Math.PI*C*(i/myArrayBuffer.length) + D*y2 );

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