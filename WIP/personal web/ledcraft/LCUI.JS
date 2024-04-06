"use strict";

class LedPanel {  
  width=0;
  height=0;
  leds=[];
  constructor(myWidth, myHeight) 
  {
	  this.width=myWidth;
	  this.height=myWidth;
	  
	  //console.log("LedPanel: constructor "+myWidth+" "+myHeight);
	  
	  for (let i=0;i<this.width*this.height; i++)
		  this.leds.push(0);
  }  
  copyFromLedPanel(myLedPanel)
  {
	  if (!( myLedPanel instanceof LedPanel))
	  {
		  throw new Error("LedPanel: copyFromLedPanel: instanceof err");
	  }
	  this.width=myLedPanel.width;
	  this.height=myLedPanel.height;
	  this.leds.length=0; // delete current array values
	  for (let i=0;i<myLedPanel.width*myLedPanel.height; i++)
		  this.leds.push(myLedPanel.leds[i]);
  }
  setLed(xpos, ypos, value)
  {
	  this.leds[(ypos*this.width)+xpos]=value;
  }
  getLed(xpos, ypos)
  {
	  return this.leds[(ypos*this.width)+xpos];
  }
  exportToString() {
	  
	  let myString="";
	  let convArray = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
	  
	  for (let i=0;i<this.width*this.height; i++){
		  myString+=convArray[ this.leds[i] ];
	  }
	  
	  return myString;
  }
  importFromString(myString) {

	// width and height are checked elsewhere
	this.leds.length=0; // delete current array values
	  
	for (let i=0;i<this.width*this.height; i++){
		switch(myString[i]) {
			case '0':  // if (x === 'valor1')
				this.leds.push(0);
				break;
			case '1':  // if (x === 'valor1')
				this.leds.push(1);
				break;
			case '2':  // if (x === 'valor1')
				this.leds.push(2);
				break;
			case '3':  // if (x === 'valor1')
				this.leds.push(3);
				break;
			case '4':  // if (x === 'valor1')
				this.leds.push(4);
				break;
			case '5':  // if (x === 'valor1')
				this.leds.push(5);
				break;
			case '6':  // if (x === 'valor1')
				this.leds.push(6);
				break;
			default:
				throw new Error("LedPanel: importFromString invalid value error: "+myString[i]);
				break;
		}
	  }
	  
	  return myString;
  }
  shiftUp() {
	  let ledsBackup=[];
	  
	  for (let i=0; i<this.width; i++)
		  ledsBackup.push(this.getLed(i, 0));
	  
	  for (let y=1; y<this.height; y++)
		  for (let x=0; x<this.width; x++){
			  this.setLed(x, y-1, this.getLed(x, y));
		  }
	  
	  for (let i=0; i<this.width; i++)
		  this.setLed(i, this.height-1, ledsBackup[i]);			
  }
  shiftDown() {
	  let ledsBackup=[];
	  
	  for (let i=0; i<this.width; i++)
		  ledsBackup.push(this.getLed(i, this.height-1));
	  
	  for (let y=this.height-2; y>=0; y--)
		  for (let x=0; x<this.width; x++){
			  this.setLed(x, y+1, this.getLed(x, y));
		  }
	  
	  for (let i=0; i<this.width; i++)
		  this.setLed(i, 0, ledsBackup[i]);
  }
  shiftLeft() {
	  let ledsBackup=[];
	  
	  for (let i=0; i<this.height; i++)
		  ledsBackup.push(this.getLed(0, i));
	  
	  for (let y=0; y<this.height; y++)
		  for (let x=1; x<this.width; x++){
			  this.setLed(x-1, y, this.getLed(x, y));
		  }
	  
	  for (let i=0; i<this.height; i++)
		  this.setLed(this.width-1, i, ledsBackup[i]);			
  }
  shiftRight() {
	  let ledsBackup=[];
	  
	  for (let i=0; i<this.height; i++)
		  ledsBackup.push(this.getLed(this.width-1, i));
	  
	  for (let y=0; y<this.height; y++)
		  for (let x=this.width-2; x>=0; x--){
			  this.setLed(x+1, y, this.getLed(x, y));
		  }
	  
	  for (let i=0; i<this.height; i++)
		  this.setLed(0, i, ledsBackup[i]);			

  }
}

class LedMovie {  
  ledPanelWidth=0;
  ledPanelHeight=0;
  ledFrames=[];
  constructor(w, h) 
  {
	  this.ledFrames.push(new LedPanel(w, h));
  }  
  copyFromLedMovie(myLedMovie)
  {
	  if (!( myLedMovie instanceof LedMovie))
	  {
		  throw new  Error("LedMovie: copyFromLedMovie: instanceof err");
	  }
		 
	  this.ledFrames.length=0; // delete current array?
	  this.ledPanelWidth=myLedMovie.ledPanelWidth;
	  this.ledPanelHeight=myLedMovie.ledPanelHeight;
	  for (let i=0; i<myLedMovie.ledFrames.length; i++)
	  {
		  let myLedPanel= new LedPanel(this.ledPanelHeight, this.ledPanelHeight);
		  myLedPanel.copyFromLedPanel(myLedMovie.ledFrames[i]);
		  this.ledFrames.push(myLedPanel);		  
	  }
  }
}

class LedPen {  
  penImages=[];
  currentPen=1;
  constructor() 
  {
	  this.penImages.push(document.getElementById("led0IMG"));
	  this.penImages.push(document.getElementById("led1IMG"));
	  this.penImages.push(document.getElementById("led2IMG"));
	  this.penImages.push(document.getElementById("led3IMG"));
	  this.penImages.push(document.getElementById("led4IMG"));
	  this.penImages.push(document.getElementById("led5IMG"));
	  this.penImages.push(document.getElementById("led6IMG"));
	  this.currentPen=1;// at start, draw in blue
  }  
  getCurrentPenImage()
  {
	  return this.penImages[this.currentPen];
  }
  getCurrentPen()
  {
	  return this.currentPen;
  }
  setCurrentPen(myIndex)
  {
	  this.currentPen=myIndex;
  }
}

function initializeUI() {
  //alert( '¡Hola a todos!' );
  const LEDImageWidth=22;
  const LEDImageHeight=22;
  const canvasWidthInLEDs=25;
  const canvasHeightInLEDs=25;
  let canvas = document.getElementById('mainCanvas');
  let canvasContext = canvas.getContext("2d");
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;

  
  // create global variable with the current default movie
  let currLedMovie= new LedMovie(canvasWidthInLEDs, canvasHeightInLEDs);
  window.currentLedMovie=currLedMovie;
  let currLedPage=0; 
  window.currentLedMoviePage=currLedPage; // first page of a new movie
  //some global variables for drawing
  window.currentLEDImageWidth=LEDImageWidth;
  window.currentLEDImageHeight=LEDImageHeight;
  window.currentcanvasWidthInLEDs=canvasWidthInLEDs;
  window.currentcanvasHeightInLEDs=canvasHeightInLEDs;
  window.currentcanvasContext=canvasContext;
  window.currentcanvasWidthInPixels=canvasWidth;
  window.currentcanvasHeightInPixels=canvasHeight;
  //window.canvasXpos=canvas.offsetLeft;
  //window.canvasYpos=canvas.offsetTop;
  // some global variables for mouse event listerners
  window.isLedMoviePlaying=false;
  window.ledWhereMouseGotDownX=-1;
  window.ledWhereMouseGotDownY=-1;
  window.ledWhereMouseGotDownValue=-1;
  window.ledWhereMouseLastMovedX=-1;
  window.ledWhereMouseLastMovedY=-1;
  window.isMouseDown=false;
  //some global vars for timers and playing
  window.timerID=null;
  window.ledMovieFPSs=1;
  document.getElementById('RadioButton1FPS').checked=true;// set FPSs accordingly
  // set clipboard to an empty page
  window.clipboardLedPanel=new LedPanel(canvasWidthInLEDs, canvasHeightInLEDs);
  // the pen that selects a color from the palette
  window.globalPen=new LedPen();
  // where the load movie process will store the movie asyc
  window.importedLedMovie=null;
  
  drawCurrentLedMoviePage();
  updateCurrentLedMoviePageText();
  
  // handle canvas events
  canvas.onmousedown=cavasMouseDownEventHandler;
  canvas.onmouseup=cavasMouseUpEventHandler;
  canvas.onmousemove=cavasMouseMoveEventHandler;
  canvas.onmouseleave=cavasMouseLeaveEventHandler;
  
  //handle buttons events
  let leftArrowButton = document.getElementById('leftArrowButton');
  let rightArrowButton = document.getElementById('rightArrowButton');
  leftArrowButton.onclick=leftArrowButtonClickHandler;
  rightArrowButton.onclick=rightArrowButtonClickHandler;
  //
  let playButton = document.getElementById('playButton');
  playButton.onclick=playButtonClickHandler;
  //
  let exportGIFButton = document.getElementById('exportAsGIFButton');
  exportGIFButton.onclick=exportGIFButtonClickHandler;
  //
  let CopyButton = document.getElementById('CopyButton');
  CopyButton.onclick=CopyButtonClickHandler;
  let CutButton = document.getElementById('CutButton');
  CutButton.onclick=CutButtonClickHandler;
  let PasteButton = document.getElementById('PasteButton');
  PasteButton.onclick=PasteButtonClickHandler;

  // handle FPS selection changes
  let RadioButton1FPSButton = document.getElementById('RadioButton1FPS');
  RadioButton1FPSButton.onchange=function (myEvent){ updateFPSFromPage(); };
  let RadioButton2FPSButton = document.getElementById('RadioButton2FPS');
  RadioButton2FPSButton.onchange=function (myEvent){ updateFPSFromPage(); };
  let RadioButton5FPSButton = document.getElementById('RadioButton5FPS');
  RadioButton5FPSButton.onchange=function (myEvent){ updateFPSFromPage(); };

  //document.getElementById('led6IMG').style.border="3px solid yellow";
  // handle clicks on the palette
  let paletteIMG0 = document.getElementById('led0IMG');
  paletteIMG0.onclick=function (myEvent) { updateSelectedPenInPage(0); };
  let paletteIMG1 = document.getElementById('led1IMG');
  paletteIMG1.onclick=function (myEvent) { updateSelectedPenInPage(1); };
  let paletteIMG2 = document.getElementById('led2IMG');
  paletteIMG2.onclick=function (myEvent) { updateSelectedPenInPage(2); };
  let paletteIMG3 = document.getElementById('led3IMG');
  paletteIMG3.onclick=function (myEvent) { updateSelectedPenInPage(3); };
  let paletteIMG4 = document.getElementById('led4IMG');
  paletteIMG4.onclick=function (myEvent) { updateSelectedPenInPage(4); };
  let paletteIMG5 = document.getElementById('led5IMG');
  paletteIMG5.onclick=function (myEvent) { updateSelectedPenInPage(5); };
  let paletteIMG6 = document.getElementById('led6IMG');
  paletteIMG6.onclick=function (myEvent) { updateSelectedPenInPage(6); };
  updateSelectedPenInPage(1); // start drawing with blue
  
  // load/save to slot buttons
  let SaveButton = document.getElementById('SaveButton');
  SaveButton.onclick=SaveButtonClickHandler;
  let LoadButton = document.getElementById('LoadButton');
  LoadButton.onclick=LoadButtonClickHandler;

  // shift buttons
  let ShiftLeftButton = document.getElementById('ShiftLeftButton');
  ShiftLeftButton.onclick=function () {
	if (window.isLedMoviePlaying) { // not drawing, just stopping the movie playing
		ledMovieStop();
		return;
	}
	let currLedPanel=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
	currLedPanel.shiftLeft();
	drawCurrentLedMoviePage();
  };
  let ShiftRightButton = document.getElementById('ShiftRightButton');
  ShiftRightButton.onclick=function () {
	if (window.isLedMoviePlaying) { // not drawing, just stopping the movie playing
		ledMovieStop();
		return;
	}
	let currLedPanel=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
	currLedPanel.shiftRight();
	drawCurrentLedMoviePage();
  };
  let ShiftUpButton = document.getElementById('ShiftUpButton');
  ShiftUpButton.onclick=function () {
	if (window.isLedMoviePlaying) { // not drawing, just stopping the movie playing
		ledMovieStop();
		return;
	}
	let currLedPanel=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
	currLedPanel.shiftUp();
	drawCurrentLedMoviePage();
  };
  let ShiftDownButton = document.getElementById('ShiftDownButton');
  ShiftDownButton.onclick=function () {
	if (window.isLedMoviePlaying) { // not drawing, just stopping the movie playing
		ledMovieStop();
		return;
	}
	let currLedPanel=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
	currLedPanel.shiftDown();
	drawCurrentLedMoviePage();
  };
  
  // when we click on the bar that shows the page number, we want to jump pages
  let myCurrentPageLabel = document.getElementById('currentPageLabel');
  myCurrentPageLabel.onclick=function (myEvent) {
	if (window.isLedMoviePlaying) { // not drawing, just stopping the movie playing
		ledMovieStop();
		return;
	}
	let pageToJumpTo=Math.round( (myEvent.offsetX/myCurrentPageLabel.clientWidth)*(window.currentLedMovie.ledFrames.length-1) );
	pageToJumpTo=Math.min(Math.max(pageToJumpTo, 0), (window.currentLedMovie.ledFrames.length-1));
	window.currentLedMoviePage=pageToJumpTo;
	drawCurrentLedMoviePage();
	updateCurrentLedMoviePageText();
  }
  

}


function cavasMouseDownEventHandler(myEvent)
{
	//let footer = document.getElementById("docfooter");
	//footer.textContent=(myEvent.offsetX)+" "+(myEvent.offsetY);
	if (window.isLedMoviePlaying) // not drawing, just stopping the movie playing
	{
		ledMovieStop();
		return;
	}
	
	window.isMouseDown=true;
	let ledX=Math.floor(myEvent.offsetX/window.currentLEDImageWidth);
	let ledY=Math.floor(myEvent.offsetY/window.currentLEDImageHeight);
	
	window.ledWhereMouseGotDownX=ledX;
	window.ledWhereMouseGotDownY=ledY;
	window.ledWhereMouseLastMovedX=ledX;
	window.ledWhereMouseLastMovedY=ledY;
	// keep a copy of the value where the mouse went down
	let targetMoviePage=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
	window.ledWhereMouseGotDownValue=targetMoviePage.getLed(ledX, ledY); 
	
	//targetMoviePage.setLed(ledX, ledY, 1);
	targetMoviePage.setLed(ledX, ledY, window.globalPen.getCurrentPen());	
	drawCurrentLedMoviePage();
	
}
function cavasMouseUpEventHandler(myEvent)
{
	//let footer = document.getElementById("docfooter");
	//footer.textContent=(myEvent.offsetX)+" "+(myEvent.offsetY);
	window.isMouseDown=false;
	
	let ledX=Math.floor(myEvent.offsetX/window.currentLEDImageWidth);
	let ledY=Math.floor(myEvent.offsetY/window.currentLEDImageHeight);

	if ((window.ledWhereMouseGotDownX===ledX)&&
	(window.ledWhereMouseGotDownY===ledY))
	{
		if (window.ledWhereMouseGotDownValue!=0)
		{
			let targetMoviePage=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
			targetMoviePage.setLed(ledX, ledY, 0); 
			drawCurrentLedMoviePage();
				
				//let footer = document.getElementById("docfooter");
				//footer.textContent="setLed 0 "+ledX+ " "+ledY;

		}
	}
	
	window.ledWhereMouseGotDownX=-1;
	window.ledWhereMouseGotDownY=-1;
	window.ledWhereMouseLastMovedX=-1;
	window.ledWhereMouseLastMovedY=-1;

}
function cavasMouseMoveEventHandler(myEvent)
{
	//let footer = document.getElementById("docfooter");
	//footer.textContent=(myEvent.offsetX)+" "+(myEvent.offsetY);
	if (!(window.isMouseDown)) // if the mouse is not down we aren't drawing, thus, return
		return; 
	
	let ledX=Math.floor(myEvent.offsetX/window.currentLEDImageWidth);
	let ledY=Math.floor(myEvent.offsetY/window.currentLEDImageHeight);
	
	if ((ledX===window.ledWhereMouseLastMovedX) && (ledY===window.ledWhereMouseLastMovedY))
		return; // no more job to do here
	else
	{
		window.ledWhereMouseLastMovedX=ledX;
		window.ledWhereMouseLastMovedY=ledY;
		
		let targetMoviePage=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
		//targetMoviePage.setLed(ledX, ledY, 1);
		targetMoviePage.setLed(ledX, ledY, window.globalPen.getCurrentPen());		
		drawCurrentLedMoviePage();		
	}
}

function cavasMouseLeaveEventHandler(myEvent)
{
	window.isMouseDown=false;
	window.ledWhereMouseGotDownX=-1;
	window.ledWhereMouseGotDownY=-1;
	window.ledWhereMouseLastMovedX=-1;
	window.ledWhereMouseLastMovedY=-1;
}



function leftArrowButtonClickHandler(myEvent)
{
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}
	
	if (window.currentLedMoviePage===0)
		return;
	
	//just going back one page in movie
	window.currentLedMoviePage--;
	drawCurrentLedMoviePage();
	updateCurrentLedMoviePageText();

}

function rightArrowButtonClickHandler(myEvent)
{
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}

	if (window.currentLedMoviePage===(window.currentLedMovie.ledFrames.length-1))
	{
		// if we're already at the end of the ledmovie array, add new frame at the end
		window.currentLedMovie.ledFrames.push(new LedPanel(window.currentcanvasWidthInLEDs, 
															window.currentcanvasHeightInLEDs));
		window.currentLedMoviePage++;
		drawCurrentLedMoviePage();
		updateCurrentLedMoviePageText();
		return; 
	}
	
	//just advancing one page in movie
	window.currentLedMoviePage++;
	drawCurrentLedMoviePage();
	updateCurrentLedMoviePageText();

}

function playButtonClickHandler(myEvent)
{
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}
	
	updateFPSFromPage(); // get the selected speed FPSs from page
	
	//if we only have one frame, we don't play
	if (window.currentLedMovie.ledFrames.length<=1)
	{
		return;
	}
	
	// start from the first frame
	window.currentLedMoviePage=0;
	drawCurrentLedMoviePage();
	updateCurrentLedMoviePageText();
	window.isLedMoviePlaying=true;
	let myTimerID=setInterval(() => {playTimerFunc();}, (1000/window.ledMovieFPSs));
	window.timerID=myTimerID;
}

function playTimerFunc()
{
	if (window.currentLedMoviePage>=(window.currentLedMovie.ledFrames.length-1))
	{
		window.currentLedMoviePage=0;
	}
	else
	{
		window.currentLedMoviePage++;
	}
	drawCurrentLedMoviePage();
	updateCurrentLedMoviePageText();
}

function ledMovieStop()
{
	window.isLedMoviePlaying=false;
	if (window.timerID!=null)
		clearInterval(window.timerID);
	window.timerID=null;
}

function exportGIFButtonClickHandler(myEvent)
{
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}

	updateFPSFromPage(); // get the selected speed FPSs from page

	/*  //test exporting to gif
  //
  var imgs = document.querySelectorAll('img');
  var ag = new Animated_GIF(); 
  ag.setSize(320, 240);
  //
  for (var i = 0; i < imgs.length; i++) {
    ag.addFrame(imgs[i]);
  }
  //
  var animatedImage = document.createElement('img');
  //
  // This is asynchronous, rendered with WebWorkers
  ag.getBase64GIF(function(image) {
    animatedImage.src = image;
    document.body.appendChild(animatedImage);
  });
  */

  //we will show the image in a new window
  let newWin = window.open("about:blank", "processing", "width="+window.currentcanvasWidthInPixels+",height="+window.currentcanvasHeightInPixels);
  newWin.document.write("Exporting to GIF...");

  //create the animated gid object and add the frames
  let ag = new Animated_GIF(); 
  ag.setSize(window.currentcanvasWidthInPixels, window.currentcanvasHeightInPixels);
  
  ag.setDelay(1000/window.ledMovieFPSs); // in ms

  let myAGIFCanvas=ag.getCanvasContextMOD();
  
  for (let i = 0; i < window.currentLedMovie.ledFrames.length; i++) {
	drawLedMoviePageToCanvas(myAGIFCanvas, 
									window.currentcanvasWidthInPixels, window.currentcanvasHeightInPixels, 
									i);
    ag.addFrameMOD();
  }

  // add the image to the document
  let animatedImage = newWin.document.createElement('img');
  //
  // This is asynchronous, rendered with WebWorkers
  ag.getBase64GIF(function(image) {
    animatedImage.src = image;
    //document.body.appendChild(animatedImage);
	newWin.document.body.appendChild(animatedImage);
  });
  
}

function CopyButtonClickHandler(myEvent)
{
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}
	
	let currLedPanel=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
	window.clipboardLedPanel.copyFromLedPanel(currLedPanel);
}

function CutButtonClickHandler(myEvent)
{
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}

	//copy and delete current ledpanel
	let currLedPanel=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
	window.clipboardLedPanel.copyFromLedPanel(currLedPanel); // copy current ledpanel
	window.currentLedMovie.ledFrames.splice(window.currentLedMoviePage, 1);//delete it from movie array
	//if last page, move to former page
	if (window.currentLedMoviePage>=window.currentLedMovie.ledFrames.length)
		window.currentLedMoviePage--;
		
	// if we cut the only page, first page will be blank
	if (window.currentLedMovie.ledFrames.length===0)
	{
		window.currentLedMovie.ledFrames.push(new LedPanel(window.currentcanvasWidthInLEDs, 
															window.currentcanvasHeightInLEDs));
		window.currentLedMoviePage=0;
	}

	drawCurrentLedMoviePage();
	updateCurrentLedMoviePageText();
}

function PasteButtonClickHandler(myEvent)
{
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}
	
	//insert the content of clipboard in the current position
	let newLedP=new LedPanel(window.currentcanvasWidthInLEDs, window.currentcanvasHeightInLEDs);
	newLedP.copyFromLedPanel(window.clipboardLedPanel);
	window.currentLedMovie.ledFrames.splice(window.currentLedMoviePage, 0, newLedP);
	
	drawCurrentLedMoviePage();
	updateCurrentLedMoviePageText();

}

function SaveButtonClickHandler(myEvent) {
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}

	let slotSelect = document.getElementById("SaveLoadSlotSelect");
  
	let displayText="Save movie to "+slotSelect.value+ " ?";
	if (confirm(displayText)) {
		// Save it!
	
		// object that will be written to DB
		let fileObject = {
			magic: "LCMF",
			version: 1,
			widthInLEDs:window.currentcanvasWidthInLEDs,
			heightInLEDs:window.currentcanvasHeightInLEDs,
			ledsInfoString:""
		};
		
		// collect all the strings that will be written to DB
		for (let i = 0; i < window.currentLedMovie.ledFrames.length; i++) {
			let myFrame=window.currentLedMovie.ledFrames[i];
			fileObject.ledsInfoString+= myFrame.exportToString();
		}
		//window.importedLedMovie= fileObject;
		storeFileToIndexedDB(fileObject, ""+slotSelect.value);

	} else {
	// Do nothing!
	}
}
function LoadButtonClickHandler(myEvent) {
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}

	let slotSelect = document.getElementById("SaveLoadSlotSelect");
  
	let displayText="Load movie from "+slotSelect.value+ " ?";
	if (confirm(displayText)) {
		
		// load it!
		readFileFromIndexedDB(""+slotSelect.value, function(){
									//
									// this function will be executed when the file is actually read from DB
									//
									if ((window.importedLedMovie===null)||(window.importedLedMovie===undefined)) {
										alert("No such file or database error");
										return;
									}

									let myFileObject=window.importedLedMovie;
									if ((myFileObject.widthInLEDs!=window.currentcanvasWidthInLEDs)
										|| (myFileObject.heightInLEDs!=window.currentcanvasHeightInLEDs)) {
											console.log(" "+myFileObject.widthInLEDs+" "+myFileObject.heightInLEDs);
											throw new Error("LoadButtonClickHandler: Width/heights differ");
										}
									
									let currLedMovie= new LedMovie(window.currentcanvasWidthInLEDs, window.currentcanvasHeightInLEDs);
									let frameLengthInLeds=(window.currentcanvasWidthInLEDs*window.currentcanvasHeightInLEDs);
									
									currLedMovie.ledFrames.length=0; // delete current array
									let numFramesToLoad=myFileObject.ledsInfoString.length/frameLengthInLeds;
									//console.log(
									//let myStringToWorkWith=myFileObject.ledsInfoString;

									// cut the string into pieces of frame length
									let strFrom=0;
									for (let i=0; i<numFramesToLoad; i++) {
										currLedMovie.ledFrames.push(new LedPanel(window.currentcanvasWidthInLEDs, 
																					window.currentcanvasHeightInLEDs));		
										let subStr=myFileObject.ledsInfoString.substr(strFrom, frameLengthInLeds);
										currLedMovie.ledFrames[i].importFromString(subStr);
										strFrom+=frameLengthInLeds;
									}
									
									// now, the processed file will be written to the current led movie
									// set clipboard to an empty page
									window.clipboardLedPanel=new LedPanel(window.currentcanvasWidthInLEDs, window.currentcanvasHeightInLEDs);									
									if (window.isLedMoviePlaying)
										ledMovieStop();
									//// set as the new movie
									window.currentLedMovie=currLedMovie;			
									window.currentLedMoviePage=0;
									window.importedLedMovie=null; // clean up a bit
									drawCurrentLedMoviePage();
									updateCurrentLedMoviePageText();
														}
			);
	}

	else {
	// Do nothing!
	}
}

function storeFileToIndexedDB(myObject, slotname)
{
	let openRequest = indexedDB.open("store", 1);

	openRequest.onupgradeneeded = function(event) {
		// se dispara si el cliente no tiene la base de datos
		// ...ejecuta la inicialización...
	
		// la versión de la base existente es menor que 2 (o ni siquiera existe)
		let db = openRequest.result;
		switch(event.oldVersion) { // versión de db existente
			case 0:
			// version 0 significa que el cliente no tiene base de datos
			// ejecutar inicialización
				console.log("storeFileToIndexedDB openRequest.onupgradeneeded: event.oldVersion "+ 0);
				// create object store
				var objectStore = db.createObjectStore("fileslots");
				break;
			case 1:
			// el cliente tiene la versión 1
			// actualizar
				console.log("storeFileToIndexedDB openRequest.onupgradeneeded: event.oldVersion "+ 1);
				break;
		}
	};

	openRequest.onerror = function() {
	console.error("storeFileToIndexedDB Error", openRequest.error);
	};

	openRequest.onsuccess = function() {
		let db = openRequest.result;
		// continúa trabajando con la base de datos usando el objeto db
		
		//console.log("storeFileToIndexedDB openRequest.onsuccess");
		
		// store a file
		let transaction = db.transaction('fileslots', 'readwrite')
		let fileSlotsStore = transaction.objectStore('fileslots');
		let request=fileSlotsStore.put(myObject, slotname);
		
		request.onsuccess = function() { // (4)
		console.log("storeFileToIndexedDB request.onsuccess: "+slotname);
		};

		request.onerror = function() {
		console.log("storeFileToIndexedDB request.onerror: ", request.error);
		};
		
		transaction.oncomplete = function() {
		console.log("storeFileToIndexedDB transaction.oncomplete");
		};
		
		transaction.onerror = function(){
		console.error('storeFileToIndexedDB transaction.onerror: '+transaction.error);
		};

		db.onversionchange = function() {
			db.close();
			alert("storeFileToIndexedDB Error: database needs update. Reload page.");
			};
			
		db.close();
	};
	
	openRequest.onblocked = function() {
		// este evento no debería dispararse si hemos manejado onversionchange correctamente

		// significa que hay otra conexión abierta a la misma base
		// que no fue cerrada después de que se disparó db.onversionchange
		alert("storeFileToIndexedDB openRequest.onblocked")
	};
}

function readFileFromIndexedDB(slotname, myCallback)
{
	let file=null;
	
	let myPromise = new Promise(function(resolve, reject) {

		let openRequest = indexedDB.open("store", 1);

		openRequest.onupgradeneeded = function(event) {
			// se dispara si el cliente no tiene la base de datos
			// ...ejecuta la inicialización...
		
			// la versión de la base existente es menor que 2 (o ni siquiera existe)
			let db = openRequest.result;
			switch(event.oldVersion) { // versión de db existente
				case 0:
				// version 0 significa que el cliente no tiene base de datos
				// ejecutar inicialización
					console.log("openRequest.onupgradeneeded: event.oldVersion "+ 0);
					// create object store
					var objectStore = db.createObjectStore("fileslots");
					break;
				case 1:
				// el cliente tiene la versión 1
				// actualizar
					console.log("openRequest.onupgradeneeded: event.oldVersion "+ 1);
					break;
			}
		};

		openRequest.onerror = function() {
		console.error("readFileFromIndexedDB Error", openRequest.error);
		resolve();
		};

		openRequest.onsuccess = function() {
			let db = openRequest.result;
			// continúa trabajando con la base de datos usando el objeto db
			
			console.log("readFileFromIndexedDB openRequest.onsuccess");
			
			// store a file
			let transaction = db.transaction('fileslots', 'readwrite')
			let fileSlotsStore = transaction.objectStore('fileslots');
			
			let promise = new Promise(function(resolve, reject) {
				
				let request=fileSlotsStore.get(slotname);
							
				request.onsuccess = function() { // (4)
				console.log("readFileFromIndexedDB request.onsuccess: "+ slotname);
				//file=request.result;
				resolve(request.result);
				};

				request.onerror = function() {
				console.log("readFileFromIndexedDB request.onerror: ", request.error);
				reject(null);
				};
				
			});
			
			promise.then(
			  function(result) { /* manejar un resultado exitoso */ 
								//console.log("promise: got "+result);
								file=result;
								},
			  function(error) { /* manejar un error */ 
								//console.log("ERROR: promise: got "+error);
								file=null;
								}
			);
			
			
			transaction.oncomplete = function() {
			console.log("readFileFromIndexedDB transaction.oncomplete");
			resolve();
			};
			
			transaction.onerror = function(){
			console.error('readFileFromIndexedDB transaction.onerror: '+transaction.error);
			resolve();
			};

			db.onversionchange = function() {
				db.close();
				resolve();
				alert("readFileFromIndexedDB Error: database needs update. Reload page.");
				};
				
			db.close();
		};
		
		openRequest.onblocked = function() {
		// este evento no debería dispararse si hemos manejado onversionchange correctamente

		// significa que hay otra conexión abierta a la misma base
		// que no fue cerrada después de que se disparó db.onversionchange
		alert("readFileFromIndexedDB openRequest.onblocked")
		resolve();
		};
	});
	
	myPromise.then(
				function(result) { // manejar un resultado exitoso 
								//console.log("outer promise: got "+file);
								window.importedLedMovie=file;
								myCallback();
								},
				function(error) { // manejar un error
								//console.log("outer promise ERROR: promise: got :"+file);
								window.importedLedMovie=file;
								myCallback();
								}
			);
	//console.log("end of readFileFromIndexedDB");
}



/*
 * Checks what FPS radio button is selected and sets FPSs global vars accodingly
 */
function updateFPSFromPage()
{
  let radioButtons = document.getElementsByName("FPS");
  for(let i = 0; i < radioButtons.length; i++)
    {
        if(radioButtons[i].checked == true)
        {
            if (radioButtons[i].value=="1FPS")
				window.ledMovieFPSs=1;
            if (radioButtons[i].value=="2FPS")
				window.ledMovieFPSs=2;
            if (radioButtons[i].value=="5FPS")
				window.ledMovieFPSs=5;
        }
    }
}

function drawLedMoviePageToCanvas(myCanvasCTX, canvasWidthInPixels, canvasHeightInPixels, myLedPage)
{
  /*let blackLedIMG = document.getElementById("led2IMG");
  let blueLedIMG = document.getElementById("led0IMG");*/
  //ctx.drawImage(blackLedIMG, 0, 0, LEDImageWidth, LEDImageHeight);
  let myLedImageWidth=canvasWidthInPixels/window.currentcanvasWidthInLEDs;
  let myLedImageHeight=canvasHeightInPixels/window.currentcanvasHeightInLEDs;
  
  let currLedPanel=window.currentLedMovie.ledFrames[myLedPage];
  
  for (let y=0; y<window.currentcanvasHeightInLEDs; y++)
  {
	for (let x=0; x<window.currentcanvasWidthInLEDs; x++)
	{
		/*if (currLedPanel.leds[(y*currentcanvasWidthInLEDs)+x]===0)
		{
			myCanvasCTX.drawImage(blackLedIMG, 
			x*myLedImageWidth, y*myLedImageHeight, 
			myLedImageWidth, myLedImageHeight);
		}
		else
		{
			myCanvasCTX.drawImage(blueLedIMG, 
			x*myLedImageWidth, y*myLedImageHeight, 
			myLedImageWidth, myLedImageHeight);
			//console.log (currLedPanel.leds[(y*currentcanvasWidthInLEDs)+x]);
		}*/
		let ledValue=currLedPanel.leds[(y*currentcanvasWidthInLEDs)+x];
		let ledValueIMG=window.globalPen.penImages[ledValue];
		myCanvasCTX.drawImage(ledValueIMG, x*myLedImageWidth, y*myLedImageHeight, myLedImageWidth, myLedImageHeight);		
	}
  }

}


function drawCurrentLedMoviePage()
{
/*  let blackLedIMG = document.getElementById("led0IMG");
  let blueLedIMG = document.getElementById("led1IMG");*/
  //ctx.drawImage(blackLedIMG, 0, 0, LEDImageWidth, LEDImageHeight);
  
  let currLedPanel=window.currentLedMovie.ledFrames[window.currentLedMoviePage];
  
  for (let y=0; y<window.currentcanvasHeightInLEDs; y++)
  {
	for (let x=0; x<window.currentcanvasWidthInLEDs; x++)
	{
		/*if (currLedPanel.leds[(y*currentcanvasWidthInLEDs)+x]===0)
		{
			window.currentcanvasContext.drawImage(blackLedIMG, 
			x*window.currentLEDImageWidth, y*window.currentLEDImageHeight, 
			window.currentLEDImageWidth, window.currentLEDImageHeight);
		}
		else
		{
			window.currentcanvasContext.drawImage(blueLedIMG, 
			x*window.currentLEDImageWidth, y*window.currentLEDImageHeight, 
			window.currentLEDImageWidth, window.currentLEDImageHeight);
			//console.log (currLedPanel.leds[(y*currentcanvasWidthInLEDs)+x]);
		}*/	
		let ledValue=currLedPanel.leds[(y*currentcanvasWidthInLEDs)+x];
		let ledValueIMG=window.globalPen.penImages[ledValue];
		window.currentcanvasContext.drawImage(ledValueIMG, 
			x*window.currentLEDImageWidth, y*window.currentLEDImageHeight, 
			window.currentLEDImageWidth, window.currentLEDImageHeight);

	}
  }
}
  
function updateCurrentLedMoviePageText()
{
	  let currMovPageText = document.getElementById("currentPageLabel");
	  currMovPageText.textContent=(window.currentLedMoviePage+1) + "/" + window.currentLedMovie.ledFrames.length;
}

function updateSelectedPenInPage(penIndex)
{
	if (window.isLedMoviePlaying)
	{
		ledMovieStop();
		return;
	}

	window.globalPen.setCurrentPen(penIndex);
	(window.globalPen.getCurrentPenImage()).style.border="3px solid yellow";

	for (let i=0; i<window.globalPen.penImages.length; i++)
	{
		if (i!=penIndex)
		{
			  window.globalPen.penImages[i].style.border="3px solid black";
		}
	}
}
