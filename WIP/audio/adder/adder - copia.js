"use strict";

/*
This code belongs to pubic domain (2023)
*/

function initializeUI() {

    document.getElementById("HarmonicSwitch").addEventListener('sl-change', event => {
        HarmonicOnChangeHandler();
      });

}

function W2FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
}

function W3FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
}

function HarmonicOnChangeHandler() {
    //console.log("HarmonicOnChangeHandler: "+document.getElementById("HarmonicSwitch").checked);
    if (document.getElementById("HarmonicSwitch").checked) {

        document.getElementById("W2FInput").value="1234";
        document.getElementById("W3FInput").value="5678";

        document.getElementById("W2FRange").disabled=true;
        document.getElementById("W2FInput").disabled=true;
        document.getElementById("W3FRange").disabled=true;
        document.getElementById("W3FInput").disabled=true;
    } else {
        document.getElementById("W2FRange").disabled=false;
        document.getElementById("W2FInput").disabled=false;
        document.getElementById("W3FRange").disabled=false;
        document.getElementById("W3FInput").disabled=false;
    }
}