'use strict';

// Audio worklet code
class continuoussp extends AudioWorkletProcessor {

    audioTestStopRequested=null;
    audioCtxSampleRate=-1;

    samplesProcessed=0;
    parsedValues=null;

    // audio buffer vars
    bufferLength=1024;
    bufferStart=0;
    bufferNumOfSamples=0;
    bufferFFT=new Float64Array(this.bufferLength); // signal to be processed
    // audio buffer vars

    // fills the audio buffer
    fillBuffer() {
      for (let i=0; i<this.bufferLength; i++) {
        let t=this.samplesProcessed/this.audioCtxSampleRate;
        this.samplesProcessed++;
        this.bufferFFT[i]=this.getSineAmplitudeFor(t);
      }
      this.bufferStart=0;
      this.bufferNumOfSamples=this.bufferLength;
      //
      // perform the FFT for the band-pass
      let bandPassFreq1=0;
      let bandPassFreq2=24000;
      if (this.parsedValues.MinFreq<=this.parsedValues.MaxFreq) {
        bandPassFreq1=this.parsedValues.MinFreq;
        bandPassFreq2=this.parsedValues.MaxFreq; 
      }
      else {
        bandPassFreq2=this.parsedValues.MinFreq;
        bandPassFreq1=this.parsedValues.MaxFreq; 
      }
      bandPassFreq1=bandPassFreq1*(this.audioCtxSampleRate*0.5)/100; 
      bandPassFreq2=bandPassFreq2*(this.audioCtxSampleRate*0.5)/100; 
      //
      let phasors = fft(this.bufferFFT);
      // first we clear the upper part of the FFT
      for (let i=(phasors.real.length/2)+1; i<phasors.real.length; i++) {
          phasors.real[i]=0;
          phasors.imag[i]=0;
      }
      // we cut all the frequencies except between bandPassFreq1 and bandPassFreq2
      // The frequency of the kth bin is given by, k × (sampling_rate / N)
      for (let i=0; i<=(phasors.real.length/2); i++) {
        let thisBinFreq=i*this.audioCtxSampleRate/this.bufferLength;
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
      let reconstructedSignal = ifft(phasors);
      for (let i=0; i<this.bufferLength; i++)
        this.bufferFFT[i]=reconstructedSignal.real[i];
      // FFT
    }

    // gets one sample from buffer
    getOneSample() {
      if (this.bufferNumOfSamples<=0)
        this.fillBuffer()
      let res=this.bufferFFT[this.bufferStart];
      this.bufferStart++;
      this.bufferNumOfSamples--;
      return res;
    }

    //generate a square wave
    getSquareAmplitudeFor (t) {
      let freq=440;
      let v=Math.sin( (2*Math.PI*freq*t) );
      let squarewave=1;
      if (v<0)
        squarewave=-1;
      return squarewave;
    }

    //generate a sine wave
    getSineAmplitudeFor (t) {
      let freq=440;
      let v=Math.sin( (2*Math.PI*freq*t) );
      return v;
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

            //let t=((i+this.samplesProcessed)/this.audioCtxSampleRate);    // this is why we need the count of samples processed, to get time t
            channel[i] = this.getOneSample(); //this.getAmplitudeFor(t); // simply write the amplitude values to output buffer
          }

          // FFT TEST
/*          let bandPassFreq1=0;
          let bandPassFreq2=24000;
          if (this.parsedValues.MinFreq<=this.parsedValues.MaxFreq) {
            bandPassFreq1=this.parsedValues.MinFreq;
            bandPassFreq2=this.parsedValues.MaxFreq; 
          }
          else {
            bandPassFreq2=this.parsedValues.MinFreq;
            bandPassFreq1=this.parsedValues.MaxFreq; 
          }
          bandPassFreq1=bandPassFreq1*(this.audioCtxSampleRate*0.5)/100; 
          bandPassFreq2=bandPassFreq2*(this.audioCtxSampleRate*0.5)/100; 
          //
          let bufferFFT=new Float64Array(channel.length); // signal to be processed
          for (let i=0; i<channel.length; i++)
            bufferFFT[i]=channel[i];
          let phasors = fft(bufferFFT);
          //
          // first we clear the upper part of the FFT
          for (let i=(phasors.real.length/2)+1; i<phasors.real.length; i++) {
              phasors.real[i]=0;
              phasors.imag[i]=0;
          }
          // we cut all the frequencies except between bandPassFreq1 and bandPassFreq2
          // The frequency of the kth bin is given by, k × (sampling_rate / N)
          for (let i=0; i<=(phasors.real.length/2); i++) {
            let thisBinFreq=i*this.audioCtxSampleRate/channel.length;
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
          let reconstructedSignal = ifft(phasors);
          for (let i=0; i<channel.length; i++)
            channel[i]=reconstructedSignal.real[i];
          // FFT TEST
          

      });
      this.samplesProcessed+=output[0].length; // wee need the count of samples processed to obtain time t
    */ });

      if (this.audioTestStopRequested==true) {
            console.log("AudioWorkletProcessor: exit requested");
            return false;
      }

      //console.log("outputs.length="+outputs[0][0].length) //128 in mozilla and chrome
      return true;
    }
  }

////// FFT FUNCTIONS

// memoization of the reversal of different lengths.
var memoizedReversal = {};
var memoizedZeroBuffers = {}

let constructComplexArray = function(signal){
  var complexSignal = {};

  complexSignal.real = (signal.real === undefined) ? signal.slice() : signal.real.slice();

  var bufferSize = complexSignal.real.length;

  if(memoizedZeroBuffers[bufferSize] === undefined){
    memoizedZeroBuffers[bufferSize] = Array.apply(null, Array(bufferSize)).map(Number.prototype.valueOf, 0);
  }

  complexSignal.imag = memoizedZeroBuffers[bufferSize].slice();

  return complexSignal;
}

let bitReverseArray = function(N){
  if(memoizedReversal[N] === undefined){
    let maxBinaryLength = (N - 1).toString(2).length; //get the binary length of the largest index.
    let templateBinary = '0'.repeat(maxBinaryLength); //create a template binary of that length.
    let reversed = {};
    for(let n = 0; n < N; n++){
      let currBinary = n.toString(2); //get binary value of current index.

      //prepend zeros from template to current binary. This makes binary values of all indices have the same length.
      currBinary = templateBinary.substr(currBinary.length) + currBinary;

      currBinary = [...currBinary].reverse().join(''); //reverse
      reversed[n] = parseInt(currBinary, 2); //convert to decimal
    }
    memoizedReversal[N] = reversed; //save
  }
  return memoizedReversal[N];
}

// complex multiplication
let multiply = function(a, b){
  return {
          'real': a.real * b.real - a.imag * b.imag,
          'imag': a.real * b.imag + a.imag * b.real
        };
}

// complex addition
let add = function(a, b){
  return {
          'real': a.real + b.real,
          'imag': a.imag + b.imag
        };
}

// complex subtraction
let subtract = function(a, b){
  return {
            'real': a.real - b.real,
            'imag': a.imag - b.imag
        };
}

// euler's identity e^x = cos(x) + sin(x)
let euler = function(kn, N){
  let x = -2 * Math.PI * kn / N;
  return {'real': Math.cos(x), 'imag': Math.sin(x)};
}

// complex conjugate
let conj = function(a){
  a.imag *= -1;
  return a;
}
////////7


// real to complex fft
let fft = function(signal){

  let complexSignal = {};

  if(signal.real === undefined || signal.imag === undefined){
    complexSignal = constructComplexArray(signal);
  }
  else {
    complexSignal.real = signal.real.slice();
    complexSignal.imag = signal.imag.slice();
  }

  const N = complexSignal.real.length;
  const logN = Math.log2(N);

  if(Math.round(logN) != logN) throw new Error('Input size must be a power of 2.');

  if(complexSignal.real.length != complexSignal.imag.length){
    throw new Error('Real and imaginary components must have the same length.');
  }

  const bitReversedIndices = bitReverseArray(N);

  // sort array
  let ordered = {
    'real': [],
    'imag': []
  };

  for(let i = 0; i < N; i++){
    ordered.real[bitReversedIndices[i]] = complexSignal.real[i];
    ordered.imag[bitReversedIndices[i]] = complexSignal.imag[i];
  }

  for(let i = 0; i < N; i++){
    complexSignal.real[i] = ordered.real[i];
    complexSignal.imag[i] = ordered.imag[i];
  }
  // iterate over the number of stages
  for(let n = 1; n <= logN; n++){
    let currN = Math.pow(2, n);

    // find twiddle factors
    for(let k = 0; k < currN / 2; k++){
      let twiddle = euler(k, currN);

      // on each block of FT, implement the butterfly diagram
      for(let m = 0; m < N / currN; m++){
        let currEvenIndex = (currN * m) + k;
        let currOddIndex = (currN * m) + k + (currN / 2);

        let currEvenIndexSample = {
                          'real': complexSignal.real[currEvenIndex],
                          'imag': complexSignal.imag[currEvenIndex]
                        }
        let currOddIndexSample = {
                          'real': complexSignal.real[currOddIndex],
                          'imag': complexSignal.imag[currOddIndex]
                        }

        let odd = multiply(twiddle, currOddIndexSample);

        let subtractionResult = subtract(currEvenIndexSample, odd);
        complexSignal.real[currOddIndex] = subtractionResult.real;
        complexSignal.imag[currOddIndex] = subtractionResult.imag;

        let additionResult = add(odd, currEvenIndexSample);
        complexSignal.real[currEvenIndex] = additionResult.real;
        complexSignal.imag[currEvenIndex] = additionResult.imag;
      }
    }
  }

  return complexSignal;
}

// complex to real ifft
let ifft = function(signal){

  if(signal.real === undefined || signal.imag === undefined){
    throw new Error("IFFT only accepts a complex input.")
  }

  const N = signal.real.length;

  var complexSignal = {
    'real': [],
    'imag': []
  };

  //take complex conjugate in order to be able to use the regular FFT for IFFT
  for(let i = 0; i < N; i++){
    let currentSample = {
      'real': signal.real[i],
      'imag': signal.imag[i]
    };

    let conjugateSample = conj(currentSample);
    complexSignal.real[i] = conjugateSample.real;
    complexSignal.imag[i] = conjugateSample.imag;
  }

  //compute
  let X = fft(complexSignal);

  //normalize
  complexSignal.real = X.real.map((val) => {
    return val / N;
  });

  complexSignal.imag = X.imag.map((val) => {
    return val / N;
  });

  return complexSignal;
}

function Hann(n, N) {
  return (0.5-( 0.5*Math.cos((2*Math.PI*n)/N) ));
}
  
  registerProcessor("continuoussp", continuoussp);
  