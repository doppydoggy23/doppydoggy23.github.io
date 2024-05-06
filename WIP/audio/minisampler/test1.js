"use strict";

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

function drawMusicPattern() {
    let canvas = document.getElementById('myCanvas');
    let ctx = canvas.getContext("2d");
    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;


/*    ctx.resetTransform();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 100, 100);*/
    //ctx.moveTo(100, 100);

    let patternLength=25;
    let numInstruments=5;

    //
    let squareSide=Math.floor(canvasWidth/patternLength);
    for (let ii=0; ii<numInstruments; ii++) {        
        
        let ypos=(ii*squareSide)+Math.floor(squareSide/2);
        for (let i=0; i<patternLength; i++) {
            let xpos=(i*squareSide)+Math.floor(squareSide/2);            
            drawPoint(ctx, xpos, ypos, squareSide*0.1);
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