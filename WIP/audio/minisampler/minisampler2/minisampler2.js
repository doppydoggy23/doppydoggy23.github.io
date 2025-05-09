"use strict";

let Globals = {
    numInstruments: 5,
    musicPattern: null, // array that holds the music pattern
    maxMusicPatternLength: 35, // should match or be larger than <sl-range> PatternLengthRange
    //internalTimerFPS: 10, // max value of internalFrames. Should be equal than <SpeedRange> max
    //
    currentColumn: 0,
    isPlaying: false,
    timerID: null,
    //internalFrames: 0, // counter that counts how many ticks before playing the next note
    saveFileName: "MyRythm.json", // name of the save file
    instrumentButtonSelected: null, // if an instrument selection button is pressed
    allSamples:[], // all the samples ready to be player here
    myAudioContext: null, //global audio context. Chrome causes trouble if you need to create more than one
    currentlySelectedSlot: null, // currently selected (X, Y) square of screen
};

function initializeUI() {

    loadSamples();

/*    document.addEventListener("keydown", (event) => {
        if (event.repeat) // avoid repeated keystrokes
            return;
        keyPressed(event.keyCode);
        // do something
      });*/
/*    document.addEventListener("keyup", (event) => {
        if (event.repeat)
            return;
        keyReleased(event.keyCode);
        // do something
      });
*/
      //console.log ("initializeUI()");
      
      // create empty music paterns
      Globals.musicPattern= new Array(Globals.numInstruments);
      for (let i=0; i<Globals.numInstruments; i++) {
        Globals.musicPattern[i]=new Array(Globals.maxMusicPatternLength);
        for (let x=0; x<Globals.maxMusicPatternLength; x++) {
            Globals.musicPattern[i][x]=null;
        }
      }

      //attach to the track length range controller its change event handler
      document.getElementById("PatternLengthRange").addEventListener('sl-change', event => {
        patternLengthOnChange();
      });

      //attach to the speed range controller its change event handler
      document.getElementById("SpeedRange").addEventListener('sl-change', event => {
        speedRangeOnChange();
      });

      //attach to the track length range controller its change event handler
      document.getElementById("NoteRange").addEventListener('sl-change', event => {
        //let relfreq=getNoteRelativeFrequency(document.getElementById("NoteRange").value);
        //let volume=document.getElementById("VolumeRange").value;
        //playSampleByNumber(0, relfreq, volume);
        //console.log("val:"+document.getElementById("NoteRange").value);
        if (Globals.currentlySelectedSlot!=null) {
            if (Globals.currentlySelectedSlot==null)
                return;
            
            Globals.musicPattern[Globals.currentlySelectedSlot.ySquare][Globals.currentlySelectedSlot.xSquare]= 
            { note: document.getElementById("NoteRange").value, volume: document.getElementById("VolumeRange").value};

            let relfreq=getNoteRelativeFrequency(document.getElementById("NoteRange").value);
            let volume=document.getElementById("VolumeRange").value;
            let sampleNum=(document.getElementById("Selector"+(Globals.currentlySelectedSlot.ySquare+1)).value.slice(5) -1); // remove the "sound" label and adjust the sample number        
            playSampleByNumber(sampleNum, relfreq, volume);

            drawMusicPattern(); // ToDo: check is it's playing to call this function with true 
        }
    });

    //ToDo: I should probably mix these two events calling a single function, since they're the same.

    document.getElementById("VolumeRange").addEventListener('sl-change', event => {
        //let relfreq=getNoteRelativeFrequency(document.getElementById("NoteRange").value);
        //let volume=document.getElementById("VolumeRange").value;
        //playSampleByNumber(0, relfreq, volume);
        //console.log("val:"+document.getElementById("NoteRange").value);
        if (Globals.currentlySelectedSlot!=null) {
            if (Globals.currentlySelectedSlot==null)
                return;
            
            Globals.musicPattern[Globals.currentlySelectedSlot.ySquare][Globals.currentlySelectedSlot.xSquare]= 
            { note: document.getElementById("NoteRange").value, volume: document.getElementById("VolumeRange").value};

            let relfreq=getNoteRelativeFrequency(document.getElementById("NoteRange").value);
            let volume=document.getElementById("VolumeRange").value;
            let sampleNum=(document.getElementById("Selector"+(Globals.currentlySelectedSlot.ySquare+1)).value.slice(5) -1); // remove the "sound" label and adjust the sample number        
            playSampleByNumber(sampleNum, relfreq, volume);
        }
    });

      //drawMusicPattern();
      setTimeout( ()=> { drawMusicPattern(); }, 1000); // FF will allow you to draw right after body.onload, but Chrome doesn't

      window.oncontextmenu = function (evt) { // prevent right click context menu
        evt.preventDefault();
      }

      document.getElementById("myCanvas").onmousedown = function(event) { // when right-click on a marked square, it means we want to edit its data
        if (event.button>1) { // we only check for right button click
            let canvas = document.getElementById('myCanvas');
            let ctx = canvas.getContext("2d");
            let canvasWidth = canvas.width;
            let canvasHeight = canvas.height;
        
            let patternLength=document.getElementById("PatternLengthRange").value;
            let squareSide=Math.floor(canvasWidth/patternLength);
        
            let xSquare=Math.floor(event.offsetX/squareSide);
            let ySquare=Math.floor(event.offsetY/squareSide);

            //console.log("xsquare="+xSquare+" ysquare="+ySquare);

            let myNote=Globals.musicPattern[ySquare][xSquare];
            if (myNote==null)
                return;

            document.getElementById("NoteRange").value=myNote.note;
            document.getElementById("VolumeRange").value=myNote.volume;
            Globals.currentlySelectedSlot= {xSquare, ySquare};
        }
      };
}

function loadSamples () {

    //list of mp3 samples
    const MP3files=[
        // bells
        "sounds/bells/bell1.mp3", "sounds/bells/cowbell1.mp3", "sounds/bells/cowbell2.mp3", "sounds/bells/woodPerc.mp3",

        //chord
        "sounds/chord/chordSteelDr.mp3", "sounds/chord/ChordWhomp.mp3", "sounds/chord/ChordWoodPerc.mp3", "sounds/chord/flangeGuitar.mp3",
        "sounds/chord/piano1.mp3", "sounds/chord/StringedPluck.mp3", "sounds/chord/waterGong.mp3", "sounds/chord/whompSynth.mp3",

        //claps
        "sounds/claps/clap1.mp3", "sounds/claps/CLAP2.mp3", "sounds/claps/Clap3.mp3", "sounds/claps/CrispClap.mp3", "sounds/claps/Lug.mp3",

        // cymbals
        "sounds/cymbals/CLANK01.mp3", "sounds/cymbals/CrashBIG.mp3", "sounds/cymbals/CRASHHard.mp3", "sounds/cymbals/DustyShaker.mp3",
        "sounds/cymbals/hat1.mp3", "sounds/cymbals/OpenHat.mp3", "sounds/cymbals/TightCym.mp3",

        //drum
        "sounds/drum/ANALOGSNARE.mp3", "sounds/drum/ATTACKKICK.mp3", "sounds/drum/BEEFSTOMPA.mp3", "sounds/drum/BoomyAMS.mp3",
        "sounds/drum/BOWSERNAT.mp3", "sounds/drum/HARDKICK.mp3", "sounds/drum/LoFiRimshot.mp3", "sounds/drum/MaterialDRY.mp3",
        "sounds/drum/Percussion01.mp3", "sounds/drum/ROOMSTOMP.mp3", "sounds/drum/ROTOLOWNAT.mp3", "sounds/drum/RuffKick.mp3",
        "sounds/drum/SHORTSNARE.mp3", "sounds/drum/TIGHTSNAPPY.mp3", "sounds/drum/Tom1BIG.mp3", "sounds/drum/TonalPerc.mp3", 
        "sounds/drum/TRAPPYsnare.mp3", "sounds/drum/WARMKNOCKER.mp3", "sounds/drum/WOOD1.mp3",

        //electronic
        "sounds/electronic/elec1.mp3", "sounds/electronic/elec2.mp3", "sounds/electronic/elec3.mp3", "sounds/electronic/elec4.mp3",
        "sounds/electronic/elec5.mp3", "sounds/electronic/elec6.mp3", "sounds/electronic/elec7.mp3", "sounds/electronic/elec8.mp3",
        "sounds/electronic/elec9.mp3", "sounds/electronic/elec10.mp3", "sounds/electronic/elec11.mp3", "sounds/electronic/elec12.mp3",
        "sounds/electronic/elec13.mp3", "sounds/electronic/elec14.mp3",

        //techno 
        "sounds/tecno/909SNR.mp3", "sounds/tecno/9091.mp3", "sounds/tecno/bass34.mp3", "sounds/tecno/BASSDRM1.mp3", "sounds/tecno/bassdrum505.mp3",
        "sounds/tecno/BASSHI1.mp3", "sounds/tecno/cgm3.mp3", "sounds/tecno/ebullet.mp3", "sounds/tecno/ElecKick1.mp3", "sounds/tecno/FSB2.mp3",
        "sounds/tecno/KICK1.mp3", "sounds/tecno/NOVBAS3.mp3", "sounds/tecno/RX15Clap.mp3", "sounds/tecno/SH2ACCOR.mp3", "sounds/tecno/SYNOTE13.mp3",
        "sounds/tecno/SYNTH3.mp3", "sounds/tecno/winvadr2.mp3"
    ];
  
    //mark buffers as null
    for (let i=0; i<MP3files.length; i++) {
      Globals.allSamples[i]=null;
    }
  
    const audioContext = new AudioContext();
  
    for (let i=0; i<MP3files.length; i++) {
      fetch(MP3files[i])
      .then(response => response.arrayBuffer())
      .then(buffer => audioContext.decodeAudioData(buffer))
      .then(myBuffer => Globals.allSamples[i]=myBuffer);
      
    }
}

function playSampleByNumber(number, pitchShift=1.0, volume=1) {

    if ((Globals.allSamples==null)||(Globals.allSamples[number]==null)) {
      return;
    }
  
    if (Globals.myAudioContext==null) {
        Globals.myAudioContext = new AudioContext();
    }

    const source = Globals.myAudioContext.createBufferSource();
    source.buffer = Globals.allSamples[number];
    source.playbackRate.value = pitchShift;
  
    const myGainNode = Globals.myAudioContext.createGain();
    myGainNode.gain.value = volume;

    source.onended = function() { // send to garbage collect
        myGainNode.disconnect();
        //console.log("fdfdfdssdfdfs"+Math.random);
      };

    source.connect(myGainNode);
    myGainNode.connect(Globals.myAudioContext.destination);
  
    source.start(0);
}

function keyPressed(keyCode) {
    //document.getElementById("bamboosound").play();
    //let soundNode=document.getElementById("bamboosound").cloneNode();
    //soundNode.volume=volume;
    //soundNode.play();
    soundPatternStep();

}

function PlayButtonClick() {
    Globals.instrumentButtonSelected=null;
    //console.log ("PlayButtonClick()");
    if (Globals.isPlaying)
	{
		StopButtonClick();
		return;
	}
	
    Globals.isPlaying=true;
    //Globals.internalFrames=0;
	// start from the first frame
    Globals.currentColumn=0;
    let myInterval=1000-document.getElementById("SpeedRange").value;
	let myTimerID=setInterval(() => {playTimerFunc();}, myInterval);
	Globals.timerID=myTimerID;
}

function StopButtonClick() {
    Globals.instrumentButtonSelected=null;

	Globals.isPlaying=false;
	if (Globals.timerID!=null) {
		clearInterval(Globals.timerID);
    }
    Globals.timerID=null;
    drawMusicPattern(false);
}

function playTimerFunc()
{
    soundPatternStep();
}

function speedRangeOnChange() {
    Globals.instrumentButtonSelected=null;

	if ((Globals.timerID!=null)&&(Globals.isPlaying==true)) {
		clearInterval(Globals.timerID);
        let myInterval=1000-document.getElementById("SpeedRange").value;
        let myTimerID=setInterval(() => {playTimerFunc();}, myInterval);
        Globals.timerID=myTimerID;
    }

}

function getNoteRelativeFrequency(rangePosition) {
    let negativeRelFreqs=[415/440, 392/440, 369/440, 349/440, 329/440, 311/440, 293/440, 277/440, 261/440, 246/440, 233/440, 220/440];
    let positiveRelFreqs=[466/440, 493/440, 523/440, 554/440, 587/440, 622/440, 659/440, 698/440, 739/440, 784/440, 830/440, 880/440];
    if (rangePosition==0)
      return 1;
    if (rangePosition<0)
      return negativeRelFreqs[(rangePosition*-1)-1];
    if (rangePosition>0)
      return positiveRelFreqs[rangePosition-1];
}

function soundPatternStep() {
    //console.log(document.getElementById("Selector1").value);
    let instruments=[];
    for (let i=0; i<Globals.numInstruments; i++) {
        instruments[i]=(document.getElementById("Selector"+(i+1)).value.slice(5) -1); // remove the "sound" label and adjust the sample number

    }

    drawMusicPattern(true);
    
/*    for (let i=0; i<Globals.numInstruments; i++)
    console.log(instruments[i]);*/
    for (let i=0; i<Globals.numInstruments; i++) {
          if (Globals.musicPattern[i][Globals.currentColumn]!=null) {
            //playSound(instruments[i]);
            let playobj=Globals.musicPattern[i][Globals.currentColumn];
            playSampleByNumber(instruments[i], getNoteRelativeFrequency(playobj.note), playobj.volume);
          }
    }

    Globals.currentColumn++;
    let patternLength=document.getElementById("PatternLengthRange").value;
    if (Globals.currentColumn>=patternLength) {
        Globals.currentColumn=0;
    }

    //console.log(Globals.currentColumn);
    // draw an index of current sound column
    //drawCurrentPatterColumnMarker();
}


async function keyReleased(keyCode) {
    //console.log("keyReleased :"+keyCode)  
}

function SoundButtonClick(soundNumber) {

    playSampleByNumber(soundNumber-1);
    //console.log("Sound1ButtonClick("+soundNumber+")");
    //console.log ("Should Play:"+ "sound"+soundNumber);
    //let soundNode=document.getElementById("sound"+soundNumber).cloneNode();
    //soundNode.play();

    //check if user has an instrument selected
    if (Globals.instrumentButtonSelected!=null) {
        document.getElementById("Selector"+Globals.instrumentButtonSelected).value="sound"+soundNumber;
        Globals.instrumentButtonSelected=null;
    }
}

function patternLengthOnChange() {
    Globals.instrumentButtonSelected=null;
    //console.log(document.getElementById("PatternLengthRange").value);
    drawMusicPattern();
}

function drawMusicPattern(drawColumnMarker) {
    const positiveNotesRGBs= [
        {R: 0xe6, G:0xc2, B:0x29},{R: 0xf1, G:0x71, B:0x05}, {R: 0xd1, G:0x11, B:0x49}, {R: 0x66, G:0x10, B:0xf2}, {R: 0x1a, G:0x8f, B:0xe3}, {R: 0x30, G:0x36, B:0x33}, 
        {R: 0x61, G:0xe2, B:0x94},{R: 0x2e, G:0x86, B:0xab}, {R: 0xf2, G:0x42, B:0x36}, {R: 0x23, G:0xce, B:0x33}, {R: 0x08, G:0x46, B:0xa0}, {R: 0x27, G:0x4c, B:0x77}, 
    ];
    const negativeNotesRGBs= [
        {R: 0x60, G:0x96, B:0xba},{R: 0x8b, G:0x8c, B:0x81}, {R: 0xa3, G:0xce, B:0x91}, {R: 0x41, G:0x45, B:0x35}, {R: 0xc1, G:0x98, B:0x95}, {R: 0xd3, G:0x65, B:0x62}, 
        {R: 0x6e, G:0x66, B:0x94},{R: 0xec, G:0xc4, B:0x94}, {R: 0x2d, G:0x30, B:0x47}, {R: 0x41, G:0x9d, B:0x48}, {R: 0xff, G:0xdb, B:0xd5}, {R: 0x61, G:0x89, B:0x85}, 
    ];

    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext("2d");
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;


    //let patternLength=25;
    let patternLength=document.getElementById("PatternLengthRange").value;
    let numInstruments=Globals.numInstruments;

    //clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //
    let squareSide=Math.floor(canvasWidth/patternLength);

    if (drawColumnMarker==true) {
        ctx.fillStyle = "grey";
        //ctx.fillRect(Globals.currentColumn*squareSide, 0, squareSide, canvasHeight-1);
        ctx.fillRect(Globals.currentColumn*squareSide, 0, squareSide, canvasHeight-1);    
    }

    for (let ii=0; ii<numInstruments; ii++) {        
        
        let ypos=(ii*squareSide)+Math.floor(squareSide/2);
        let roundSquareYPos=(ii*squareSide)+Math.floor(squareSide*0.1);
        //
        for (let i=0; i<patternLength; i++) {
            let xpos=(i*squareSide)+Math.floor(squareSide/2);
            let roundSquareXPos=(i*squareSide)+Math.floor(squareSide*0.1);

            let myNote=Globals.musicPattern[ii][i];
            if (myNote==null) {                
                drawPoint(ctx, xpos, ypos, squareSide*0.1);
            } else {
                let blockcolors="rgba(0, 0, 0, 1)";
                if (myNote.note>=1) {
                    let rgbs=positiveNotesRGBs[myNote.note-1];
                    blockcolors="rgba("+rgbs.R+", "+rgbs.G+", "+rgbs.B+", 1)";                
                }
                if (myNote.note<=-1) {
                    let rgbs=negativeNotesRGBs[(myNote.note*-1)-1];
                    blockcolors="rgba("+rgbs.R+", "+rgbs.G+", "+rgbs.B+", 1)";                
                }
                drawRoundButton(ctx, roundSquareXPos, roundSquareYPos, Math.floor(squareSide*0.8), Math.floor(squareSide*0.8), Math.PI*2, blockcolors);
            }
        }
    }
    //
}

function drawPoint(ctx, x, y, radius) {
    ctx.fillStyle = "black";
    ctx.beginPath();    
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fill();

}

function drawRoundButton(ctx, x, y, width, height, arcsize, myBlockColors) {
    //ctx.fillStyle = "black";
    ctx.fillStyle=myBlockColors;

    ctx.beginPath();
    ctx.moveTo(x+arcsize, y);
    ctx.lineTo(x+width-arcsize, y);
    ctx.arcTo(x+width, y, x+width, y+arcsize, arcsize);
    ctx.lineTo(x+width,y+height-arcsize);
    ctx.arcTo(x+width, y+height, x+width-arcsize, y+height, arcsize);
    ctx.lineTo(x+arcsize, y+height);
    ctx.arcTo(x, y+height, x, y-arcsize, arcsize);
    ctx.lineTo(x, y+arcsize);
    ctx.arcTo(x, y, x+arcsize, y, arcsize);
    ctx.lineTo(x+arcsize, y);
    ctx.stroke();
    ctx.fill();
}

function canvasClick(event) {
    //ToDo: check if clicks with the right button over a filled square, this could be used to load the square values to me modified instead of clearing it
    //console.log(event.offsetX+ " "+event.offsetY);
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext("2d");
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    let patternLength=document.getElementById("PatternLengthRange").value;
    let squareSide=Math.floor(canvasWidth/patternLength);

    let xSquare=Math.floor(event.offsetX/squareSide);
    let ySquare=Math.floor(event.offsetY/squareSide);

    //if (event.which>1) {
        //right click
        //console.log("right event.which: "+event.which+ " event.button: "+event.button);
    //}

    //console.log(xSquare+ " "+ ySquare);
    if (Globals.musicPattern[ySquare][xSquare]==null) {

        //reset note and volume values
        document.getElementById("NoteRange").value=0;
        document.getElementById("VolumeRange").value=1;

        Globals.musicPattern[ySquare][xSquare]= { note: document.getElementById("NoteRange").value, volume: document.getElementById("VolumeRange").value};
        Globals.currentlySelectedSlot= {xSquare, ySquare};
        
        // we play the sample
        let sampleNum=(document.getElementById("Selector"+(ySquare+1)).value.slice(5) -1); // remove the "sound" label and adjust the sample number        
        playSampleByNumber(sampleNum);
    } else {
        Globals.musicPattern[ySquare][xSquare]=null;
        Globals.currentlySelectedSlot=null;

        document.getElementById("NoteRange").value=0;
        document.getElementById("VolumeRange").value=1;
    }

    drawMusicPattern();
}


function SaveButtonClick() {
    Globals.instrumentButtonSelected=null;

    //create saving object with all the needed info
    let savingOBJ= {
        //mytext: "hello mytext",
        //sampleArray: [1, 2, 3, 4]
        magic: "MSFF",
        instruments: [],
        pattern:[],
        patternLength: 0,
        speed:0,
    }
    //save instruments
    for (let i=0; i<Globals.numInstruments; i++) {
        savingOBJ.instruments[i]=document.getElementById("Selector"+(i+1)).value;
    }
    //save pattern
    let soP=0;
    for (let i=0; i<Globals.numInstruments; i++) {
      for (let x=0; x<Globals.maxMusicPatternLength; x++) {
        savingOBJ.pattern[soP]=Globals.musicPattern[i][x];
        soP++;
      }
    }
    //save pattern length and speed
    savingOBJ.patternLength=document.getElementById("PatternLengthRange").value;
    savingOBJ.speed=document.getElementById("SpeedRange").value;
    //console.log ("" + savingOBJ.patternLength+  " "+ savingOBJ.speed);


    let content=JSON.stringify(savingOBJ);
    //let content = 'This is a text'; //original
  
    //create a file and put the content, name and type
    //let file = new File(["\ufeff"+content], 'myFile.txt', {type: "text/plain:charset=UTF-8"}); // original
    let file = new File([content], Globals.saveFileName, {type: "text/plain:charset=UTF-8"});
  
    //create a ObjectURL in order to download the created file
    let url = window.URL.createObjectURL(file);
  
    //create a hidden link and set the href and click it
    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = file.name;
    a.click();
    window.URL.revokeObjectURL(url);

    //
    //var obj = {a: 123, b: "4 5 6"};
    //var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    //console.log(""+document.getElementById("Selector1").value);
    //document.getElementById("Selector1").value="sound5";
}

function LoadButtonClick(event) {
    Globals.instrumentButtonSelected=null;
    Globals.currentlySelectedSlot=null;

    //let file = event.target.files[0];   

/*    let fr=new FileReader();
        fr.onload=function(){
        txt.value=fr.result;
    };

    fr.readAsText(event.target.files[0]);*/
    document.getElementById('my_file').onchange = function (e) {

        //console.log (""+document.getElementById("my_file").files[0]);
        var file = e.target.files[0]; 

        // setting up the reader
        var reader = new FileReader();
        reader.readAsText(file,'UTF-8');

        reader.onload = readerEvent => {
            var content = readerEvent.target.result; // this is the content!
            //console.log( content );

            let loadingOBJ=JSON.parse(content);
            //console.log (loadingOBJ.magic);

            // set all the saved instruments
            for (let i=0; i<Globals.numInstruments; i++) {
                document.getElementById("Selector"+(i+1)).value=loadingOBJ.instruments[i];
            }

            //recover the pattern
            let soP=0;
            for (let i=0; i<Globals.numInstruments; i++) {
            for (let x=0; x<Globals.maxMusicPatternLength; x++) {
                Globals.musicPattern[i][x]=loadingOBJ.pattern[soP];
                soP++;
                }
            }

            //load pattern length and speed
            //console.log ("" + loadingOBJ.patternLength+  " "+ loadingOBJ.speed);
            document.getElementById("PatternLengthRange").value=loadingOBJ.patternLength;
            document.getElementById("SpeedRange").value=loadingOBJ.speed;

            drawMusicPattern(); //refresh pattern on screen
            //ToDo: when loading a rythm while playing, the playing speed is not the one loaded, but the speed it had when the play button was clicked
         }
    }

    document.getElementById('my_file').click();

}

function Instrument1ButtonClick() {
    Globals.instrumentButtonSelected=1;
}
function Instrument2ButtonClick() {
    Globals.instrumentButtonSelected=2;    
}
function Instrument3ButtonClick() {
    Globals.instrumentButtonSelected=3;    
}
function Instrument4ButtonClick() {
    Globals.instrumentButtonSelected=4;
}
function Instrument5ButtonClick() {
    Globals.instrumentButtonSelected=5;
}