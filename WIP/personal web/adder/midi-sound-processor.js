// Audio worklet code
class MIDISoundProcessor extends AudioWorkletProcessor {

  audioCtxSampleRate=-1;
  audioTestStopRequested=null;

  notesCurrentlyPlaying = new Array();

  
  noteOnEventReceived(e) {
    //console.log("AudioWorkletProcessor: noteOn="+e.data.key); 

    let noteInfo = {
      key: e.data.key,
      samplesProcessed: 0,
      timeShiftingRatio: e.data.timeShiftingRatio,
      //
      parsedValues:e.data.parsedValues,
      //
      /*Attack: e.data.parsedValues.Attack,
      Decay: e.data.parsedValues.Decay,
      Sustain: e.data.parsedValues.Sustain+10000,
      SustainVolume: e.data.parsedValues.SustainVolume,
      Release: e.data.parsedValues.Release*/
    };
    this.notesCurrentlyPlaying.push(noteInfo); // add note to notes currently playing
    //console.log("AudioWorkletProcessor: noteOnEventReceived: M1="+noteInfo.M1);
    //console.log("AudioWorkletProcessor: noteOnEventReceived: Attack="+noteInfo.Attack+" Decay="+noteInfo.Decay+" Sustain="+noteInfo.Sustain+" SustainVolume="+noteInfo.SustainVolume+" Release="+noteInfo.Release);
    //console.log("AudioWorkletProcessor: noteOnEventReceived: Attackrrrr="+e.data.Attack);
  }

  noteOffEventReceived(e) {
    //remove note from array of notes currently playing
    for (let i=0; i<this.notesCurrentlyPlaying.length; i++) {
      if (this.notesCurrentlyPlaying[i].key==e.data.key) {

        let noteInfoS=this.notesCurrentlyPlaying[i];
          noteInfoS.key+=2000; // mark the note as Off
          let noteT=noteInfoS.samplesProcessed/this.audioCtxSampleRate;
          if (noteT<=(noteInfoS.parsedValues.Attack+noteInfoS.parsedValues.Decay)) { // we need to play attack and decay and then directly release
            noteInfoS.parsedValues.Sustain=0; // we put a 0, to directly play release after Attack and Decay
          } else { // we are in sustain. Trim values.
            noteInfoS.parsedValues.Sustain=noteT-noteInfoS.parsedValues.Attack-noteInfoS.parsedValues.Decay; // it should only play Release after this since A, D, and S already passed
          }
        }
      }
    //console.log("AudioWorkletProcessor: noteOffEventReceived: Array Length="+this.notesCurrentlyPlaying.length);
  }


  //mixes all weighted sinusoids together. returns [0..1]
  getAmplitudeFor (pParsedValues, t) {
    if (pParsedValues==null)
      return 0;
    //
    let acc=0;
    let accWeights=0;
    for (let i=0; i<pParsedValues.WFreqs.length; i++) {
        acc+= pParsedValues.WAmplitudes[i]*Math.sin( (2*Math.PI*pParsedValues.WFreqs[i]*t) ); // we add all sine waves together
        accWeights+=pParsedValues.WAmplitudes[i]; // we add all weights together
    }
    acc/=accWeights; // we divide by all weights
    return acc;
}

 //shapes the wave to adjust to ADSR values
 getWaveScaleFor (formulaValues, t) {
  if (formulaValues==null)
    return 0;
  //
  if( (formulaValues.Attack>0)&& ((t>=0)&&(t<=formulaValues.Attack)) ) {
      return (1/formulaValues.Attack)*t;
  }

  if( (formulaValues.Decay>0)&& ((t>=formulaValues.Attack)&&(t<=(formulaValues.Attack+formulaValues.Decay))) ) {
      return ( 1- (((1-formulaValues.SustainVolume)/formulaValues.Decay)*(t-formulaValues.Attack)) );
  }

  if( (formulaValues.Sustain>0)&& ((t>=(formulaValues.Attack+formulaValues.Decay))&&(t<=(formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain))) ) {
      //console.log("sustain");
      return formulaValues.SustainVolume;
  }

  if( (formulaValues.Release>0)&& ((t>=(formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain))&&(t<=(formulaValues.Attack+formulaValues.Decay+formulaValues.Sustain+formulaValues.Release))) ) {
      return ( formulaValues.SustainVolume-((formulaValues.SustainVolume/formulaValues.Release)*(t-formulaValues.Attack-formulaValues.Decay-formulaValues.Sustain)) );
  }

  return 0;
}

    // we need to define an onmessage function to received the audio data from audio.js
    constructor(...args) {
        super(...args);
        this.port.onmessage = (e) => {

          //
          if (e.data.messageType=="noteOn") {
            //console.log("AudioWorkletProcessor: noteOn="+e.data.key);            
            this.noteOnEventReceived(e);
          }
          if (e.data.messageType=="noteOff") {
            //console.log("AudioWorkletProcessor: noteOff="+e.data.key);            
            this.noteOffEventReceived(e);
          }
          if (e.data.messageType=="config") { // configuration message
            //console.log("AudioWorkletProcessor: config");            
            //this.noteOffEventReceived(e);
            this.audioTestStopRequested=e.data.audioTestStopRequested;
            this.audioCtxSampleRate=e.data.audioCtxSampleRate;

            //console.log("AudioWorkletProcessor: config="+this.audioTestStopRequested+ " "+ this.audioCtxSampleRate);
          }

          //console.log("AudioWorkletProcessor: Algorithm="+e.data.Algorithm);
        };
      }

      // function that processes the audio
    process(inputs, outputs, parameters) {

      if (this.audioTestStopRequested==null) { // it hasn't been configured yet
        return true;
      }

      if (this.notesCurrentlyPlaying.length>0)
      {
        const output = outputs[0];
        output.forEach((channel) => {
          for (let i = 0; i < channel.length; i++) {
            //
            //
            let accumulatedValue=0;       
            for (let notePlaying=0; notePlaying<this.notesCurrentlyPlaying.length; notePlaying++) {
              let noteInfoS=this.notesCurrentlyPlaying[notePlaying];

              let t=((i+noteInfoS.samplesProcessed)/this.audioCtxSampleRate);    // this is why we need the count of samples processed, to get time t
              let tsh=t*noteInfoS.timeShiftingRatio; // adjust the time to play the correct musical note

              accumulatedValue+=this.getAmplitudeFor(noteInfoS.parsedValues, tsh)*this.getWaveScaleFor(noteInfoS.parsedValues, t); // simply write the amplitude values to output buffer              
              //accumulatedValue+=this.getFMAmplitudeFor(noteInfoS, tsh);
            }
            channel[i]= accumulatedValue;
            //
            //
            /*
             * Please, note that naively adding all the values of signals together works fantastically in Firefox, 
             * while in Chrome you need to lower the amplitude of sines to not get cracks in sound.
            */
          }
        });

        // update the buffer position for every note playing
        for (let notePlaying=0; notePlaying<this.notesCurrentlyPlaying.length; notePlaying++) {
          let noteInfoS=this.notesCurrentlyPlaying[notePlaying];
          noteInfoS.samplesProcessed+=output[0].length; // wee need the count of samples processed to obtain time t
        }
        
      }

      // remove the notes that have ended playing
      let newNotesPlaying=new Array();
      for (let notePlaying=0; notePlaying<this.notesCurrentlyPlaying.length; notePlaying++) {
        let noteInfoS=this.notesCurrentlyPlaying[notePlaying];
        let noteT=noteInfoS.samplesProcessed/this.audioCtxSampleRate;
        if (noteT<=noteInfoS.parsedValues.Attack+noteInfoS.parsedValues.Decay+noteInfoS.parsedValues.Sustain+noteInfoS.parsedValues.Release){
          newNotesPlaying.push(noteInfoS);
        }
      }
      //
      //if ((this.notesCurrentlyPlaying.length>0)&&(newNotesPlaying.length==0))
      //  console.log("no more notes in array");
      //
      this.notesCurrentlyPlaying=newNotesPlaying;

      return true;
    }
  }
  
  //do the reg pp
  registerProcessor("midi-sound-processor", MIDISoundProcessor);
  