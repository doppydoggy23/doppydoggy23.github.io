"use strict";

/*
This code belongs to pubic domain (2024)
*/

const GlobalConstants = {
    MaxWaveFrequency: 10000,
    MinWaveFrequency: 0,
    DefaultWaveFrequency: 440,
}

function initializeUI() {

/*    document.getElementById("HarmonicSwitch").addEventListener('sl-change', event => {
        HarmonicOnChangeHandler();
      });*/

    document.getElementById("W1FInput").addEventListener('sl-change', event => {
        W1FrequencyTextOnChange();
    })
    document.getElementById("W2FInput").addEventListener('sl-change', event => {
        W2FrequencyTextOnChange();
    })
    document.getElementById("W3FInput").addEventListener('sl-change', event => {
        W3FrequencyTextOnChange();
    })

}

function AjustGUIForValidValues () {
    //Sinusoid 1
    let value=parseInt(document.getElementById("W1FInput").value);
    if (isNaN(value)) {
        document.getElementById("W1FInput").value=""+GlobalConstants.DefaultWaveFrequency;
    }
    if (value<GlobalConstants.MinWaveFrequency) {
        document.getElementById("W1FInput").value=""+GlobalConstants.MinWaveFrequency;
    }
    if (value>GlobalConstants.MaxWaveFrequency) {
        document.getElementById("W1FInput").value=""+GlobalConstants.MaxWaveFrequency;
    }
    
    //Sinusoid 2
    value=parseInt(document.getElementById("W2FInput").value);
    if (isNaN(value)) {
        document.getElementById("W2FInput").value=""+GlobalConstants.DefaultWaveFrequency;
    }
    if (value<GlobalConstants.MinWaveFrequency) {
        document.getElementById("W2FInput").value=""+GlobalConstants.MinWaveFrequency;
    }
    if (value>GlobalConstants.MaxWaveFrequency) {
        document.getElementById("W2FInput").value=""+GlobalConstants.MaxWaveFrequency;
    }
    
    //Sinusoid 3
    value=parseInt(document.getElementById("W3FInput").value);
    if (isNaN(value)) {
        document.getElementById("W3FInput").value=""+GlobalConstants.DefaultWaveFrequency;
    }
    if (value<GlobalConstants.MinWaveFrequency) {
        document.getElementById("W3FInput").value=""+GlobalConstants.MinWaveFrequency;
    }
    if (value>GlobalConstants.MaxWaveFrequency) {
        document.getElementById("W3FInput").value=""+GlobalConstants.MaxWaveFrequency;
    }
    
}

function W1FrequencySliderOnInput () {
    document.getElementById("W1FInput").value=document.getElementById("W1FRange").value;
}

function W2FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
    document.getElementById("W2FInput").value=document.getElementById("W2FRange").value;
}

function W3FrequencySliderOnInput(){
    //console.log("W2FrequencySliderOnInput : "+document.getElementById("W2Range").value);
    document.getElementById("W3FInput").value=document.getElementById("W3FRange").value;
}

function W1FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W1FRange").value=document.getElementById("W1FInput").value;
}

function W2FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W2FRange").value=document.getElementById("W2FInput").value;
}

function W3FrequencyTextOnChange() {
    AjustGUIForValidValues();
    document.getElementById("W3FRange").value=document.getElementById("W3FInput").value;
}

function retrieveParsedValues() {
    AjustGUIForValidValues(); // ToDo: check if this function takes too much time, in case real time sound becomes laggy
    let W1F=parseInt(document.getElementById("W1FInput").value);
    let W2F=parseInt(document.getElementById("W2FInput").value);
    let W3F=parseInt(document.getElementById("W3FInput").value);
    return {W1F, W2F, W3F};
}
function PlayButtonClick() {
    console.log (retrieveParsedValues());
}

function SelectHarmonicsOptionRGOnChange() {
    //console.log("HarmonicOnChangeHandler: "+document.getElementById("HarmonicSwitch").checked);
    if (document.getElementById("SelectHarmonicsOptionRG").value==2) {

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

/*function SelectHarmonicsOptionRGOnChange () {
    console.log(""+document.getElementById("SelectHarmonicsOptionRG").value);
}*/