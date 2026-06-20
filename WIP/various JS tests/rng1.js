"use strict";

function initializeUI() {


    let rnd_seed=0;

    let myParagraph = document.getElementById("maintext");
    myParagraph.textContent="";

    for (let i=0; i<100; i++) {
        let x=xorshiftrnd8(rnd_seed);
        rnd_seed=x;
        myParagraph.textContent+= " "+rnd_seed;
    }

}

function xorshiftrnd8(rnd_seed) {
	// Algorithm "xor" from p. 4 of Marsaglia, "Xorshift RNGs"

    rnd_seed+=123;
    rnd_seed &= 0xff;
    rnd_seed^= (rnd_seed << 5);
    rnd_seed^= (rnd_seed >> 3);
    rnd_seed^= (rnd_seed << 1);
    rnd_seed &= 0xff;
	return rnd_seed;
}
