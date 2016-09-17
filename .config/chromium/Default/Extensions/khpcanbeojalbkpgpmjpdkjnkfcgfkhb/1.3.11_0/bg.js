
var iframe = {};

function checkBlacklist(url) {
	// evaluate black list
	var bl = localStorage.blacklist.split(/\n/);
	for(i in bl){
		var pattern = bl[i];
		if(typeof(pattern) != "string") continue;
		if(pattern.length == 0) continue;
		if(RegExp(pattern).test(url)) {
			console.log("blacklist pattern [" + pattern + "] matched to [" + document.location.href + "]\n");
			return true; 
		}
	}

	return false;
}

function refreshPrefAll() {
	// request all instance to refresh their pref
	chrome.windows.getAll({populate:true},function(wins){
		for(i in wins) { var w = wins[i];
			for(j in w.tabs){ var t = w.tabs[j];
				chrome.tabs.sendMessage(t.id,{msg:"refresh_pref"}); 
			}
		}
	});
}

chrome.tabs.onRemoved.addListener(function(tabid){
	delete iframe[tabid];
});

chrome.extension.onMessage.addListener(function(request,sender,response){

	if(request.msg == "iframe_broadcast"){
		//ignore broadcast from blacklist-ed page
		if(checkBlacklist(sender.tab.url)) return;
		console.log(sender.tab.id + " " + request.msg + " " + request.src + " ," + request.scrolling);
		var key = "" + sender.tab.id;
		if(iframe[key] == undefined) iframe[key] = [];
		iframe[key].push(request);

		request.msg = "iframe_push";
		chrome.tabs.sendMessage(sender.tab.id,request);

		response({});
	}
	else if(request.msg == "iframe_pull"){
		console.log(sender.tab.id + " " + request.msg + " " + request.src + " " + request.referrer);
		var key = "" + sender.tab.id;
		var f = iframe[key];
		for(i in f){
			if(request.src.indexOf(f[i].src) == 0) { response(f[i]); return; }
		}
		// try with referrer
		if(request.referrer.length > 0) {
			for(i in f) {
				if(request.referrer.indexOf(f[i].src) == 0) { 
					var newentry = {src:request.src, scrolling:f[i].scrolling, topframe:f[i].topframe};
					iframe[key].push(newentry);
					response(newentry);
					return;
				}
			}
		}
		// if not found, the default value of url that is not tab url is ... 
		response((sender.tab.url == request.src) ? null : {src:request.src, scrolling:"no", topframe:false});
	}
	else if(request.msg == "loadpref"){
		console.log(sender.tab.id + " " + request.msg);
		// copy all from localStrage and send it
		var obj = {};
		for(i in localStorage) { obj[i] = localStorage[i]; }
		response(obj);
	}
	else if(request.msg == "tickwheel_set") {
		localStorage.tickwheel = request.value;
		refreshPrefAll();
	}
});

chrome.browserAction.onClicked.addListener(function(t) {
	if(localStorage.enabled == 1) {
		localStorage.enabled = 0;
	}
	else {
		localStorage.enabled = 1;
	}
	setToolbarIcon();

	refreshPrefAll();
});

if(!localStorage.a) //default
{
	localStorage.selectedpreset = "green";
	localStorage.preset_green = "40,589,224,204,86,491,227,105";
	localStorage.dolog = "";
	localStorage.edgetype = 60;
	localStorage.blacklist = "";
	localStorage.enabled = 1;
	localStorage.usepixelscroll = false;
	localStorage.tickwheel = 84;

	localStorage.a = 1;
	console.log("bg.html setting defaults");
}

// set toolbar icon on startup
function setToolbarIcon() { 
	if(localStorage.enabled == 1) {
		chrome.browserAction.setIcon({"path":"wheel.png"});
	}
	else {
		chrome.browserAction.setIcon({"path":"wheel_disabled.png"});
	}
}

setToolbarIcon();
