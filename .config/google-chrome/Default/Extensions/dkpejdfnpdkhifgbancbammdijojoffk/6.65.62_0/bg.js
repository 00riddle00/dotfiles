localTrace = function(s) {
    console.log(s);
}

// This gets sent to the background process
// Use this for viewing content script debug outside of the content script
function remoteTrace(s) {
    if (enableTrace) {
        chrome.extension.sendRequest({ trace: s });
    }
}

var socket = 0;
var focusedWindowId = -1;
var smoothScrollEnabled = -1;

function sendJsonMessage(jsonMessage) {
    try
    {
        var msgString = JSON.stringify(jsonMessage);
        trace(msgString);
        socket.send(msgString);
    }
    catch(aException)
    {
        trace_exception("sendJsonMessage", aException);
    }
}


function initWebSockets() {

  for(var i=0;i<5;++i)
  {
      var host = "ws://127.0.0.1:";
	  var hostPortNum = 59243;
	  hostPortNum = hostPortNum + i;
	  host = host + hostPortNum;  
	  trace("Port number:" + host);	
	 	
	try
    {
        trace("initWebSockets");
		socket = new WebSocket(host);
		socket.onopen = function(msg) {
            trace("connected to target");
            chrome.tabs.getSelected(null, function(tab) {
                chrome.tabs.sendRequest(tab.id, {id: "refreshContent"});
            });
        };
        break;
        socket.onerror = function(msg) {
            trace("socket.onerror");
	    };
		socket.onmessage = function(msg) {
            trace("socket.onmessage");
	    };
		socket.onclose = function(msg) {
            trace("socket.onclose");
        };
    }
    catch(aException)
    {
        trace_exception(initWebSockets, aException);
    }
 }
  trace("web socket initialized");
}

trace("ScrolLApp (chrome) background script loaded");
initWebSockets();

// this is sent from a content script
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      try
      {
          trace(request);
          // Always send it (for now)
          // There are some cases (like when CTRL is pressed) where
          // the KHALScroll state and our state can get out of sync
          if (true)
          {
              sendJsonMessage(request);
              smoothScrollEnabled = request.hiRes;
          }
      }
      catch(aException)
      {
          trace_exception("chrome.extension.onRequest.addListener", aException);
      }
  });

// Send Hi-Res whenever there is a tab change
chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {

    trace("chrome.tabs.onSelectionChanged: " + tabId);
    // Notify the respective content
    chrome.tabs.sendRequest(tabId, {id: "refreshContent"});
});

chrome.windows.onFocusChanged.addListener(function(windowId) {

    if (-1 == windowId)
    {
        // Reset the smooth scrolling
        trace("chrome in background");
        smoothScrollEnabled = -1;
    }
    else if (-1 == focusedWindowId)
    {
        trace("chrome in foreground");
        // Chrome browser gaining focus

        // If the socket is closed, reattempt
        // STATE_CLOSED => 3
        if (3 == socket.readyState)
        {
            trace("websocket connection with SetPoint is closed. Attempting to reconnect");
            initWebSockets();
        }

        // Refresh the current tab content
        chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendRequest(tab.id, {id: "refreshContent"});
        });
    }

    focusedWindowId = windowId;
});
