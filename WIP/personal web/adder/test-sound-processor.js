// Audio worklet code
class TestSoundProcessor extends AudioWorkletProcessor {

    audioTestStopRequested=null;
    audioCtxSampleRate=-1;

    samplesProcessed=0;
    parsedValues=null;


    //mixes all weighted sinusoids together. returns [0..1]
    getAmplitudeFor (pParsedValues, t) {
      //let freq=440;
      //return Math.sin( (2*Math.PI*freq*t) );
      if (pParsedValues==null)
        return 0;

      let acc=0;
      let accWeights=0;
      for (let i=0; i<pParsedValues.WFreqs.length; i++) {
          acc+= pParsedValues.WAmplitudes[i]*Math.sin( (2*Math.PI*pParsedValues.WFreqs[i]*t) ); // we add all sine waves together
          accWeights+=pParsedValues.WAmplitudes[i]; // we add all weights together
      }
      acc/=accWeights; // we divide by all weights
      return acc;
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
        // WFreqs, WAmplitudes, Attack, Decay, Sustain, SustainVolume, Release};
        //console.log("AudioWorkletProcessor: parsed values="+e.data.parsedValues.WFreqs+ " "+e.data.parsedValues.WAmplitudes+ 
        //" A.D.S.SR.R="+e.data.parsedValues.Attack+" "+e.data.parsedValues.Decay+ " " +e.data.parsedValues.Sustain+ " " +e.data.parsedValues.SustainVolume+" "+ e.data.parsedValues.Release);
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
          channel[i] = this.getAmplitudeFor(this.parsedValues, t); // simply write the amplitude values to output buffer
          //test channel[i]=0;

        }
      });
      this.samplesProcessed+=output[0].length; // wee need the count of samples processed to obtain time t

      if (this.audioTestStopRequested==true) {
            //console.log("AudioWorkletProcessor: exit requested");
            return false;
      }

      return true;
    }
  }
  
  registerProcessor("test-sound-processor", TestSoundProcessor);
  