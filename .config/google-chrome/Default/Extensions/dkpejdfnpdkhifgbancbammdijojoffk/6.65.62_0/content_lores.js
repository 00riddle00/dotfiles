localTrace = function(s) {
    console.log(s);
}

// This gets sent to the background process
// Use this for viewing content script debug outside of the content script
function remoteTrace(s) {
    if (enableTrace) {
        chrome.extension.sendRequest({trace: s});
    }
}

// this is sent from the extension
// So far, this is only sent when the tab selection has changed
// which means we refresh the content
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
      try
      {
          if (request.id == "refreshContent")
          {
              refreshContent();
          }
      }
      catch(aException)
      {
            trace_exception("chrome.extension.onRequest.addListener", aException);
      }
  });

trace("ScrolLApp (chrome) lo-res content script loaded: " + document.URL);

function enableSmoothScroll(_enable, _reason) {
    // Get it into a JSON format
    // We'll use the same format over WebSocket
    chrome.extension.sendRequest({hiRes: _enable, reason: _reason});
}


function refreshContent() {
    try
    {
        // Default is that hi-res is enabled on focus
        enableSmoothScroll(false, "blacklisted url");
    }
    catch(aException)
    {
        trace_exception("refreshContent", aException);
    }
}

refreshContent();