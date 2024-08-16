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

      //attach to the range controller its change event handler
      document.getElementById("PatternLengthRange").addEventListener('sl-change', event => {
        patternLengthOnChange();
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
    //console.log ("PlayButtonClick()");
    if (Globals.isPlaying)
	{
		StopButtonClick();
		return;
	}
	
    Globals.isPlaying=true;
    Globals.internalFrames=0;
	// start from the first frame
    Globals.currentColumn=0;
	let myTimerID=setInterval(() => {playTimerFunc();}, (1000/Globals.internalTimerFPS));
	Globals.timerID=myTimerID;
}

function StopButtonClick() {
	Globals.isPlaying=false;
	if (Globals.timerID!=null) {
		clearInterval(Globals.timerID);
    }
    Globals.timerID=null;
    drawMusicPattern(false);
}

function playTimerFunc()
{
    // check if counter Globals.internalFrames overflowed as per SpeedRange control
    let howManyIFWeMustCount=Globals.internalTimerFPS-document.getElementById("SpeedRange").value;

    if (Globals.internalFrames>=howManyIFWeMustCount) {
        soundPatternStep();
        Globals.internalFrames=0;
    } else {
        Globals.internalFrames++;
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
}

function patternLengthOnChange() {
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
    //create saving object with all the needed info
    let savingOBJ= {
        //mytext: "hello mytext",
        //sampleArray: [1, 2, 3, 4]
        magic: "MSFF",
        instruments: [],
    }
    //let instruments=[];
    for (let i=0; i<Globals.numInstruments; i++) {
        savingOBJ.instruments[i]=document.getElementById("Selector"+(i+1)).value;
    }



    let content=JSON.stringify(savingOBJ);
    //let content = 'This is a text'; //original
  
    //create a file and put the content, name and type
    //let file = new File(["\ufeff"+content], 'myFile.txt', {type: "text/plain:charset=UTF-8"}); // original
    let file = new File([content], 'myFile.txt', {type: "text/plain:charset=UTF-8"});
  
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
         }
    }

    document.getElementById('my_file').click();

}

