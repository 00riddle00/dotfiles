function str_trim(s) { return s.replace(/^\s+|\s+$/g, ""); }
function ELM(id) { return document.getElementById(id); }
function range(a,min,max) { return Math.min(max,Math.max(a-0,min)); }

function onchange()
{
	preset = new Array(8);
	// save all to localStorage
	preset[0] = range(ELM("step_w").value, 1, 300);
	preset[1] = range(ELM("smooth_w").value, 1, 100) * 8.9; // (890/100)
	preset[2] = range(ELM("smoothf_w").value, 0, 100) * 8.9
	preset[3] = range(ELM("accel_w").value, 1, 450)
	preset[4] = range(ELM("step_k").value, 1, 300);
	preset[5] = range(ELM("smooth_k").value, 1, 100) * 8.9;
	preset[6] = range(ELM("smoothf_k").value, 0, 100) * 8.9;
	preset[7] = range(ELM("accel_k").value, 0.1, 4.5) * 100;
	localStorage.preset_green = preset.join(",");
	localStorage.edgetype = range(ELM("edgetype").value, 0, 120);
	localStorage.dolog = ELM("dolog").value;
	var rawbl = ELM("blacklist").value.split(/\n/);
	var bl = [];
	for(i in rawbl){
		var p = rawbl[i];
		if(typeof(p) != "string") continue;
		if(str_trim(p).length == 0) continue;
		bl.push(str_trim(p).replace(/\./g,"\\.").replace(/\+/g,"\\+").replace(/\?/g,"\\?").replace(/\*/g,".*") + "$");
	}
	localStorage.blacklist = bl.join("\n");

	// request all instance to refresh their pref
	chrome.windows.getAll({populate:true},function(wins){
		for(i in wins) { var w = wins[i];
			for(j in w.tabs){ var t = w.tabs[j];
				chrome.tabs.sendMessage(t.id,{msg:"refresh_pref"}); 
			}
		}
	});

	// call myself
	yass.refresh_preferences();

}

function onload() {

	// restore values from localstorage
	var preset = localStorage.preset_green.split(/,/);

	ELM("step_w").value = preset[0];
	ELM("smooth_w").value = (preset[1]*(100/890)).toFixed(2);
	ELM("smoothf_w").value = (preset[2]*(100/890)).toFixed(2);
	ELM("accel_w").value = preset[3];
	ELM("step_k").value = preset[4];
	ELM("smooth_k").value = (preset[5]*(100/890)).toFixed(2);
	ELM("smoothf_k").value = (preset[6]*(100/890)).toFixed(2);
	ELM("accel_k").value = preset[7]/100.0;
	ELM("edgetype").value = localStorage.edgetype;
	if(localStorage.dolog == "true") ELM("dolog").value = "true";

	// set mouseup event handler for all faders
	var elms = document.getElementsByClassName("range");
	for(var i = 0; i < elms.length; i++){
		initfader(elms[i]);
	}

	// apply onchange handler to checkboxes
	elms = document.getElementsByClassName("checkbox");
	for(i in elms) {
		elms[i].onchange = onchange;
	}
	
	// set background image for graphbar
	elms = document.getElementsByClassName("graphbar");
	for(var i = 0; i < elms.length; i++){
		elms[i].style.backgroundImage = "url('graph.png')";
	}
	
	ELM("blacklist").value = (localStorage.blacklist + "").replace(/\\/g,"").replace(/\.\*/g,"*").replace(/\$/g,"");

	updategraph("w");
	updategraph("k");

	faderonscrollstepw();
}

function initfader(src){
	var id = src.previousElementSibling.id;
	if(id.match(/^.*_w$/)){
		if(id == "step_w") {
			src.oninput = function(){faderonscroll(src);updategraph("w");faderonscrollstepw();};
		} else {
			src.oninput = function(){faderonscroll(src);updategraph("w");};
		}
	} else if(id.match(/^.*_k$/)){
		src.oninput = function(){faderonscroll(src);updategraph("k");};
	} else {
		src.oninput = function(){faderonscroll(src);};
	}
	src.value = src.previousElementSibling.value;

}

function faderonscroll(src){
	src.previousElementSibling.value = ((src.value - 0).toFixed(2) + "").replace(".00","");
	clearTimeout(window.refreshtimer);
	window.refreshtimer = setTimeout(onchange,600); // call onchange after 600 msecs
}

function faderonscrollstepw() {
	ELM("pixelscrollscale").innerHTML = Math.floor(ELM("step_w").value / 120.0 * 100) / 100;
}

function updategraph(postfix)
{
	if((new Date()).getTime() - window["_yass_lastupdategraph_" + postfix] < 50) return;
	window["_yass_lastupdategraph_" + postfix] = (new Date()).getTime();

	var step = ELM("step_" + postfix).value;
	var bdump = ELM("smoothf_" + postfix).value/100 + 0.01;
	var edump = (900 - ELM("smooth_" + postfix).value*8.9)/1000;
	var graph = ELM("grapharea_" + postfix);
	var c = graph.getContext("2d");
	c.clearRect(0,0,300,100);

	// draw guide line
	c.fillStyle="#aaa";
	for(var t = 50; t < 300; t+= 50) {
		c.fillRect(t,0,1,100);
	}

	c.fillStyle = "#bbb";
	c.strokeStyle="#000";
	c.beginPath();
	c.moveTo(500,500);
	c.lineTo(0,500);

	var dest = (60.0 / 300.0) * step + 40.0 ;
	var d = 0;
	var bdumpbase = bdump * 110.0;
	var tipw = 5;
	for(var t = 0; t <= 60; t++)
	{
		if(d + 0.3 > dest) { break; }
		var bd = Math.min(Math.max(((t+1)/(bdumpbase)),0.05),1.0);
		d += (dest - d) * edump * bd ;
		// = "0px " + ((250) - (dest-2-d).toFixed()) + "px";
		c.lineTo(t*tipw,100-(dest-d));
	}
	c.stroke();
	c.fill();
}


function ontabselect(tabId,selectInfo){
	onchange(); 
}

function onunload() {
	onchange(); // localStorage will be saved but chrome.windows.getAll does nothing when called from here
	chrome.tabs.onSelectionChanged.removeListener(ontabselect);
}


document.addEventListener("DOMContentLoaded", function() {
	onload();
	document.body.onbeforeunload = onunload;
});

chrome.tabs.onSelectionChanged.addListener(ontabselect);


window.refreshtimer = -1;
window._yass_lastupdategraph_w = 0;
window._yass_lastupdategraph_k = 0;
