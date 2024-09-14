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
    saveFileName: "MyRythm.json",
    instrumentButtonSelected: null,
};

function initializeUI() {

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
            Globals.musicPattern[i][x]=0;
        }
      }

      //ToDo: delete
      /*Globals.musicPattern[0][0]=1;
      Globals.musicPattern[0][1]=1;
      Globals.musicPattern[0][9]=1;
      Globals.musicPattern[3][2]=1;
      Globals.musicPattern[2][5]=1;
      Globals.musicPattern[4][24]=1;*/

      //attach to the track length range controller its change event handler
      document.getElementById("PatternLengthRange").addEventListener('sl-change', event => {
        patternLengthOnChange();
      });

      //attach to the speed range controller its change event handler
      document.getElementById("SpeedRange").addEventListener('sl-change', event => {
        speedRangeOnChange();
      });

      drawMusicPattern();
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

function soundPatternStep() {
    //console.log(document.getElementById("Selector1").value);
    let instruments=[];
    for (let i=0; i<Globals.numInstruments; i++) {
        instruments[i]=document.getElementById("Selector"+(i+1)).value;

    }

    drawMusicPattern(true);
    
/*    for (let i=0; i<Globals.numInstruments; i++)
    console.log(instruments[i]);*/
    for (let i=0; i<Globals.numInstruments; i++) {
          if (Globals.musicPattern[i][Globals.currentColumn]>0) {
            playSound(instruments[i]);
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

function playSound(sound) {
    let soundNode=document.getElementById(sound).cloneNode();
    //soundNode.playbackRate.value=2;
    //soundNode.detune.value=299;
    soundNode.play();
}


function SoundButtonClick(soundNumber) {
    //console.log("Sound1ButtonClick("+soundNumber+")");
    //console.log ("Should Play:"+ "sound"+soundNumber);
    let soundNode=document.getElementById("sound"+soundNumber).cloneNode();
    soundNode.play();

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
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext("2d");
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;


/*    ctx.resetTransform();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 100, 100);*/
    //ctx.moveTo(100, 100);

    //drawRoundButton(ctx, 100, 100, 50, 20, Math.PI);

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

            if (Globals.musicPattern[ii][i]<=0) {
                drawPoint(ctx, xpos, ypos, squareSide*0.1);
            } else {            
                drawRoundButton(ctx, roundSquareXPos, roundSquareYPos, Math.floor(squareSide*0.8), Math.floor(squareSide*0.8), Math.PI*2);
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

function drawRoundButton(ctx, x, y, width, height, arcsize) {
    ctx.fillStyle = "black";
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
    //console.log(event.offsetX+ " "+event.offsetY);
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext("2d");
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    let patternLength=document.getElementById("PatternLengthRange").value;
    let squareSide=Math.floor(canvasWidth/patternLength);

    let xSquare=Math.floor(event.offsetX/squareSide);
    let ySquare=Math.floor(event.offsetY/squareSide);

    //console.log(xSquare+ " "+ ySquare);
    if (Globals.musicPattern[ySquare][xSquare]==0) {
        Globals.musicPattern[ySquare][xSquare]=1;
    } else {
        Globals.musicPattern[ySquare][xSquare]=0;
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