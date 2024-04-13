"use strict";

function initializeUI() {

    document.addEventListener("keydown", (event) => {
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
