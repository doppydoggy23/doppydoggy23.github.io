// Audio worklet code
class continuoussp extends AudioWorkletProcessor {

    audioTestStopRequested=null;
    audioCtxSampleRate=-1;

    samplesProcessed=0;
    parsedValues=null;


    //generate a square wave
    getAmplitudeFor (t) {
      let freq=440;
      let v=Math.sin( (2*Math.PI*freq*t) );
      let squarewave=1;
      if (v<0)
        squarewave=-1;
      return squarewave;
    }

    // we need to define an onmessage function to received the audio data from audio.js
    constructor(...args) {
        super(...args);
        this.port.onmessage = (e) => {

          //send deserialized data to variables
          this.audioTestStopRequested=e.data.audioTestStopRequested;
          this.audioCtxSampleRate=e.data.audioCtxSampleRate;
          this.parsedValues=e.data.parsedValues;
          //
        };
      }

      // function that processes the audio
    process(inputs, outputs, parameters) {

      if (this.audioTestStopRequested==null) { // it hasn't been configured yet
        return true;
      }

      // process the current audio values chunk
      const output = outputs[0];
      output.forEach((channel) => {
        for (let i = 0; i < channel.length; i++) {

          let t=((i+this.samplesProcessed)/this.audioCtxSampleRate);    // this is why we need the count of samples processed, to get time t
          channel[i] = this.getAmplitudeFor(t); // simply write the amplitude values to output buffer
        }
      });
      this.samplesProcessed+=output[0].length; // wee need the count of samples processed to obtain time t

      if (this.audioTestStopRequested==true) {
            console.log("AudioWorkletProcessor: exit requested");
            return false;
      }

      //console.log("outputs.length="+outputs[0][0].length) //128 in mozilla and chrome
      return true;
    }
  }
  
  registerProcessor("continuoussp", continuoussp);
  