"use strict";

function initializeUI() {
  let bg1 = new Image();
  bg1.onload = function(){
	drawScreen();
	};
  bg1.src = "336x280.png"; //"300x250.png"; //"336x280.png"; //  //"fondo2.png";  
  window.bg1=bg1;
  
  /*let animatedImage = document.createElement('img');
  document.body.appendChild(animatedImage);
  animatedImage.src = "fondo1.png";*/
  

  
  /*canvasContext.fillStyle = 'rgb(200, 0, 0)';
  canvasContext.fillRect(10, 10, 50, 50);

  canvasContext.fillStyle = 'rgba(0, 0, 200, 0.5)';
  canvasContext.fillRect(30, 30, 50, 50);
  */
  //draw background //fill canvas with background 3F88C5
  

  
  /*let bg1 = new Image();
  bg1.src = "fondo1.png";  
  
  let animatedImage = document.createElement('img');
  document.body.appendChild(animatedImage);
  animatedImage.src = "fondo1.png";
  ctx.drawImage(animatedImage, 0, 0, canvasWidth, canvasHeight);
*/
}

function drawScreen()
{
	
  let canvas = document.getElementById('mainCanvas');
  let ctx = canvas.getContext("2d");
  let canvasWidth = canvas.width;
  let canvasHeight = canvas.height;
  

	
  ctx.drawImage(window.bg1, 0, 0, canvasWidth, canvasHeight);

  const cornerPosX=106;
  const cornerPosY=62;
  const radius=124;
  
  
  //BG1'
  ctx.save();
  drawBackgroundHexagon (ctx, 200, 200, 0.5);
  ctx.restore();
  
  //BG1
  ctx.save();
  drawBackgroundHexagon (ctx, 200, 200-(radius*1.00), 0.5); 
  ctx.restore();
  //BG2
  ctx.save();
  drawBackgroundHexagon (ctx, 200+(cornerPosX*1.00), 200-(cornerPosY*1.00), 0.5); // si reducimos la escala a la mitad 
  ctx.restore();												//cornerPos también debe reducirse a la mitad
  //BG 3
  ctx.save();
  drawBackgroundHexagon (ctx, 200+(cornerPosX*1.00), 200+(cornerPosY*1.00), 0.5); // si reducimos la escala a la mitad 
  ctx.restore();												//cornerPos también debe reducirse a la mitad


  //1'
  ctx.save();
  drawHexagon (ctx, 200, 200, 0.5);
  ctx.restore();

  //1
  ctx.save();
  drawHexagon (ctx, 200, 200-(radius*1.00), 0.5); 
  ctx.restore();
  //2
  ctx.save();
  drawHexagon (ctx, 200+(cornerPosX*1.00), 200-(cornerPosY*1.00), 0.5); // si reducimos la escala a la mitad 
  ctx.restore();												//cornerPos también debe reducirse a la mitad
  //3
  ctx.save();
  drawHexagon (ctx, 200+(cornerPosX*1.00), 200+(cornerPosY*1.00), 0.5); // si reducimos la escala a la mitad 
  ctx.restore();												//cornerPos también debe reducirse a la mitad

}

function drawBackgroundHexagon(ctx, x, y, scalep) {
	
	ctx.globalAlpha=1;
	//
	ctx.translate(x, y);
	ctx.scale(scalep, scalep);	

	
	//draw background hexagon;
	
	ctx.fillStyle = 'rgba(127, 127, 127, 0.5)';

	const miniHexagonScale=1.1;
	ctx.beginPath();
    ctx.moveTo(miniHexagonScale*-70, miniHexagonScale*-123);
    ctx.lineTo(miniHexagonScale*70, miniHexagonScale*-123);
    ctx.lineTo(miniHexagonScale*142, miniHexagonScale*0);
    ctx.lineTo(miniHexagonScale*70, miniHexagonScale*123);
    ctx.lineTo(miniHexagonScale*-70, miniHexagonScale*123);
    ctx.lineTo(miniHexagonScale*-142, miniHexagonScale*0);
    ctx.lineTo(miniHexagonScale*-70, miniHexagonScale*-123);
    ctx.fill();
	//

}

function drawHexagon(ctx, x, y, scalep)
{
	let brightColors = ["#3ae8b0", "#19AFB0", "#6967CE", "#ffb900", "#fb636b", "#a0a0a0"];
	let mate1Colors = ["rgba(41, 88, 252, 1)", "rgba(13, 152, 71, 1)", "rgba(253, 176, 2, 1)", "rgba(116, 78, 143, 1)", "rgba(181, 27, 29, 1)", "rgba(150, 150, 150, 1)"];
	let mate2Colors = ["rgba(81, 177, 28, 1)", "rgba(41, 107, 204, 1)", "rgba(220, 7, 0, 1)", "rgba(237, 69, 128, 1)", "rgba(136, 85, 160, 1)", "rgba(255, 190, 0, 1)"];
	let pastel1Colors = ["#73c67f", "#515151", "#ff7979", "#348ec2", "#c2a1f4", "#f0c97f"];



	
	//ctx.lineWidth=1;
	//ctx.lineCap='butt';
	ctx.globalAlpha=1;
	//
	ctx.translate(x, y);
	ctx.scale(scalep, scalep);	
	
	//1	
	ctx.fillStyle = mate2Colors[0];//'rgba(41, 88, 252, 1)';
    ctx.beginPath();
    ctx.moveTo(-70, -124);
    ctx.lineTo(0, 0);
    ctx.lineTo(70, -124);
    ctx.fill(); // could be ctx.stroke();
	//2
	ctx.fillStyle = mate2Colors[1];//'rgba(13, 152, 71, 1)';//'#ffd166';
    ctx.beginPath();
    ctx.moveTo(70, -124);
    ctx.lineTo(0, 0);
    ctx.lineTo(142, 0);
    ctx.fill(); // could be ctx.stroke();
	//3
	ctx.fillStyle = mate2Colors[2];//'rgba(253, 176, 2, 1)';
    ctx.beginPath();
    ctx.moveTo(142, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(70, 124);
    ctx.fill(); // could be ctx.stroke();
	//4
	ctx.fillStyle = mate2Colors[3];//'rgba(116, 78, 143, 1)';
    ctx.beginPath();
    ctx.moveTo(70, 124);
    ctx.lineTo(0, 0);
    ctx.lineTo(-70, 124);
    ctx.fill(); // could be ctx.stroke();
	//5
	ctx.fillStyle = mate2Colors[4];//'rgba(181, 27, 29, 1)';
    ctx.beginPath();
    ctx.moveTo(-70, 124);
    ctx.lineTo(0, 0);
    ctx.lineTo(-142, 0);
    ctx.fill(); // could be ctx.stroke();
	//6
	ctx.fillStyle = mate2Colors[5];//'rgba(150, 150, 150, 1)';//'rgba(249, 96, 2, 1)';
    ctx.beginPath();
    ctx.moveTo(-142, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-70, -124);
    ctx.fill(); // could be ctx.stroke();


	//draw border
	/*ctx.strokeStyle = 'rgba(0, 0, 0, 1)'; //white 'rgba(255, 255, 255, 1)';//yellow 'rgba(255, 255, 0, 1)';
	ctx.lineWidth=2;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	//
	ctx.beginPath();
    ctx.moveTo(-70, -123);
    ctx.lineTo(70, -123);
    ctx.lineTo(142, 0);
    ctx.lineTo(70, 123);
    ctx.lineTo(-70, 123);
    ctx.lineTo(-142, 0);
    ctx.lineTo(-70, -123);
    ctx.stroke();*/
	
	
/*	//draw central circle
	ctx.beginPath();
	ctx.arc(0, 0, 100*scalep, 0, 2*Math.PI, 0);
	ctx.fillStyle = 'rgba(255, 255, 255, 1)';
    ctx.fill(); // could be ctx.stroke();
*/
	// draw central hexagon
	//ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
/*minihexagon	
	ctx.fillStyle = 'rgba(255, 255, 255, 1)';
	//ctx.lineWidth=10;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	//
	const miniHexagonScale=0.4;
	ctx.beginPath();
    ctx.moveTo(miniHexagonScale*-70, miniHexagonScale*-123);
    ctx.lineTo(miniHexagonScale*70, miniHexagonScale*-123);
    ctx.lineTo(miniHexagonScale*142, miniHexagonScale*0);
    ctx.lineTo(miniHexagonScale*70, miniHexagonScale*123);
    ctx.lineTo(miniHexagonScale*-70, miniHexagonScale*123);
    ctx.lineTo(miniHexagonScale*-142, miniHexagonScale*0);
    ctx.lineTo(miniHexagonScale*-70, miniHexagonScale*-123);
    ctx.fill();*/


}
  
