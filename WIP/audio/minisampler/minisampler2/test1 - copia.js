"use strict";


function initializeUI() {

      

/*    document.addEventListener("keydown", (event) => {
        if (event.repeat) // avoid repeated keystrokes
            return;
        keyPressed(event.keyCode);        
        // do something
        //let id=howlerSound.play();
        //howlerSound.rate(0.5);
        //howlerSound.play();
        //howlerSound.play();
      });*/
/*    document.addEventListener("keyup", (event) => {
        if (event.repeat)
            return;
        keyReleased(event.keyCode);
        // do something
      });
*/
      //console.log ("initializeUI()");
      
}

function keyPressed(keyCode) {
    //document.getElementById("bamboosound").play();
    //let soundNode=document.getElementById("bamboosound").cloneNode();
    //soundNode.volume=volume;
    //soundNode.play();

}

function keyReleased(keyCode) {
    //console.log("keyReleased :"+keyCode)  
}


function PlayButtonClick() {
    //console.log ("PlayButtonClick()");

    const context = new AudioContext();

    function loadSample(url) {
      return fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => context.decodeAudioData(buffer));
    }
    
    /*function playSample(sample) {
      const source = context.createBufferSource();
      source.buffer = sample;
      source.connect(context.destination);
      source.start(0);
    }*/

    function playSample(sample, rate) {
      const source = context.createBufferSource();
      source.buffer = sample;
      source.playbackRate.value = rate;
      source.connect(context.destination);
      source.start(0);
    }
    
    loadSample('bell1.mp3')
      .then(sample => playSample(sample, 0.5));

      //ToDo: play several samples at the same time
}

