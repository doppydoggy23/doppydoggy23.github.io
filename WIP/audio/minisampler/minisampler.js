"use strict";

let Globals = {
    numInstruments: 5,
    musicPattern: null,
    maxMusicPatternLength: 25 // should match or be larger than <sl-range> PatternLengthRange

};

function initializeUI() {

/*    document.addEventListener("keydown", (event) => {
        if (event.repeat) // avoid repeated keystrokes
            return;
        keyPressed(event.keyCode);
        // do something
      });
    document.addEventListener("keyup", (event) => {
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
    let soundNode=document.getElementById("bamboosound").cloneNode();
    //soundNode.volume=volume;
    soundNode.play();
}

async function keyReleased(keyCode) {
    //console.log("keyReleased :"+keyCode)  
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

function drawMusicPattern() {
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