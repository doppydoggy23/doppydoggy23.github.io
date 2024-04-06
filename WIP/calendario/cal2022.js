"use strict";

function initializeUI() {
	//console.log("initializeUI() called");
	//alert("Hello");
	let footer = document.getElementById("docfooter");

	//OnMouseEnter functions
	let minijanuary = document.getElementById("minijanuary");	
	minijanuary.onmouseenter=function(){
		setBigCalendarToJanuary();
	};
	
	let minifebruary = document.getElementById("minifebruary");
	minifebruary.onmouseenter=function(){
		//footer.innerHTML="February";
		setBigCalendarToFebruary();
	};
	
	let minimarch = document.getElementById("minimarch");
	minimarch.onmouseenter=function(){
		//footer.innerHTML="minimarch";
		setBigCalendarToMarch();
	};

	let miniapril = document.getElementById("miniapril");
	miniapril.onmouseenter=function(){
		//footer.innerHTML="miniapril";
		setBigCalendarToApril();
	};

	let minimay = document.getElementById("minimay");
	minimay.onmouseenter=function(){
		//footer.innerHTML="minimay";
		setBigCalendarToMay();
	};
	
	let minijune = document.getElementById("minijune");
	minijune.onmouseenter=function(){
		//footer.innerHTML="minijune";
		setBigCalendarToJune();
	};
	
	let minijuly = document.getElementById("minijuly");
	minijuly.onmouseenter=function(){
		//footer.innerHTML="minijuly";
		setBigCalendarToJuly();
	};
	
	let miniagust = document.getElementById("miniagust");
	miniagust.onmouseenter=function(){
		//footer.innerHTML="miniagust";
		setBigCalendarToAgust();
	};
	
	let miniseptember = document.getElementById("miniseptember");
	miniseptember.onmouseenter=function(){
		//footer.innerHTML="miniseptember";
		setBigCalendarToSeptember();
	};
	
	let minioctober = document.getElementById("minioctober");
	minioctober.onmouseenter=function(){
		//footer.innerHTML="minioctober";
		setBigCalendarToOctober();
	};
	
	let mininovember = document.getElementById("mininovember");
	mininovember.onmouseenter=function(){
		//footer.innerHTML="mininovember";
		setBigCalendarToNovember();
	};
	
	let minidicember = document.getElementById("minidicember");
	minidicember.onmouseenter=function(){
		//footer.innerHTML="minidicember";
		setBigCalendarToDecember();
	};
	

	//OnClick functions for mobile devices that don't have any onMouseEnter
	minijanuary.onclick=function(){
		//footer.innerHTML="January onclick";
		setBigCalendarToJanuary();
	};
	
	minifebruary.onclick=function(){
		//footer.innerHTML="February onclick";
		setBigCalendarToFebruary();
	};
	
	minimarch.onclick=function(){
		//footer.innerHTML="minimarch onclick";
		setBigCalendarToMarch();
	};

	miniapril.onclick=function(){
		//footer.innerHTML="miniapril onclick";
		setBigCalendarToApril();
	};

	minimay.onclick=function(){
		//footer.innerHTML="minimay onclick";
		setBigCalendarToMay();
	};
	
	minijune.onclick=function(){
		//footer.innerHTML="minijune onclick";
		setBigCalendarToJune();
	};
	
	minijuly.onclick=function(){
		//footer.innerHTML="minijuly onclick";
		setBigCalendarToJuly();
	};
	
	miniagust.onclick=function(){
		//footer.innerHTML="miniagust onclick";
		setBigCalendarToAgust();
	};
	
	miniseptember.onclick=function(){
		//footer.innerHTML="miniseptember onclick";
		setBigCalendarToSeptember();
	};
	
	minioctober.onclick=function(){
		//footer.innerHTML="minioctober onclick";
		setBigCalendarToOctober();
	};
	
	mininovember.onclick=function(){
		//footer.innerHTML="mininovember onclick";
		setBigCalendarToNovember();
	};
	
	minidicember.onclick=function(){
		//footer.innerHTML="minidicember onclick";
		setBigCalendarToDecember();
	};
	
}
/*
function minijanuaryOnMouseOverHandler(event) {

  let footer = document.getElementById("docfooter");
  footer.innerHTML="janueary";
}
*/

function setBigCalendarToJanuary() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Enero</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number_sun">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number_sun">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number_sun">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number_sun">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number_sun">30</div>'
		+'<div class="calendar__number">31</div>'
	  +'</div>';
}

function setBigCalendarToFebruary() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Febrero</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number_sun">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number_sun">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number_sun">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number_sun">27</div>'
		+'<div class="calendar__number">28</div>'
	  +'</div>';
}

function setBigCalendarToMarch() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Marzo</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number_sun">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number_sun">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number_sun">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number_sun">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number">30</div>'
		+'<div class="calendar__number">31</div>'
	  +'</div>';
}
function setBigCalendarToApril() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Abril</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number_sun">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number_sun">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number_sun">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number_sun">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number">30</div>'
	  +'</div>';
}

function setBigCalendarToMay() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Mayo</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number_sun">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number_sun">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number_sun">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number_sun">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number_sun">29</div>'
		+'<div class="calendar__number">30</div>'
		+'<div class="calendar__number">31</div>'
	  +'</div>';
}

function setBigCalendarToJune() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Junio</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number_sun">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number_sun">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number_sun">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number_sun">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number">30</div>'
	  +'</div>';
}

function setBigCalendarToJuly() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Julio</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number_sun">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number_sun">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number_sun">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number_sun">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number">30</div>'
		+'<div class="calendar__number_sun">31</div>'
	  +'</div>';
}

function setBigCalendarToAgust() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Agosto</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number_sun">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number_sun">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number_sun">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number_sun">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number">30</div>'
		+'<div class="calendar__number">31</div>'
	  +'</div>';
}

function setBigCalendarToSeptember() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Septiembre</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number_sun">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number_sun">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number_sun">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number_sun">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number">30</div>'
	  +'</div>';
}

function setBigCalendarToOctober() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Octubre</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number_sun">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number_sun">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number_sun">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number_sun">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number_sun">30</div>'
	  	+'<div class="calendar__number">31</div>'
+'</div>';
}

function setBigCalendarToNovember() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Noviembre</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number_sun">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number_sun">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number_sun">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number_sun">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number">30</div>'
	  +'</div>';
}

function setBigCalendarToDecember() {
	let bigcalendar = document.getElementById("bigcalendar");
	// we need to remove the first div '<div class="calendar" id="bigcalendar">'
	bigcalendar.innerHTML=
	  '<div class="calendar__picture">'
		+'<div class=calendar_month_name>Diciembre</div>'
		+'<!-- <h3>November</h3> -->'
	  +'</div>'
	  +'<div class="calendar__date">'
		+'<div class="calendar__day">Lu</div>'
		+'<div class="calendar__day">Ma</div>'
		+'<div class="calendar__day">Mi</div>'
		+'<div class="calendar__day">Ju</div>'
		+'<div class="calendar__day">Vi</div>'
		+'<div class="calendar__day">Sa</div>'
		+'<div class="calendar__day_sun">Do</div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number"></div>'
		+'<div class="calendar__number">1</div>'
		+'<div class="calendar__number">2</div>'
		+'<div class="calendar__number">3</div>'
		+'<div class="calendar__number_sun">4</div>'
		+'<div class="calendar__number">5</div>'
		+'<div class="calendar__number">6</div>'
		+'<div class="calendar__number">7</div>'
		+'<div class="calendar__number">8</div>'
		+'<div class="calendar__number">9</div>'
		+'<div class="calendar__number">10</div>'
		+'<div class="calendar__number_sun">11</div>'
		+'<div class="calendar__number">12</div>'
		+'<div class="calendar__number">13</div>'
		+'<div class="calendar__number">14</div>'
		+'<div class="calendar__number">15</div>'
		+'<div class="calendar__number">16</div>'
		+'<div class="calendar__number">17</div>'
		+'<div class="calendar__number_sun">18</div>'
		+'<div class="calendar__number">19</div>'
		+'<div class="calendar__number">20</div>'
		+'<div class="calendar__number">21</div>'
		+'<div class="calendar__number">22</div>'
		+'<div class="calendar__number">23</div>'
		+'<div class="calendar__number">24</div>'
		+'<div class="calendar__number_sun">25</div>'
		+'<div class="calendar__number">26</div>'
		+'<div class="calendar__number">27</div>'
		+'<div class="calendar__number">28</div>'
		+'<div class="calendar__number">29</div>'
		+'<div class="calendar__number">30</div>'
		+'<div class="calendar__number">31</div>'
	  +'</div>';
}

