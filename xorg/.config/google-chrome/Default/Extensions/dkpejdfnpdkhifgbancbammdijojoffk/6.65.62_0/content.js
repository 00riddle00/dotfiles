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

var wheelProbing            = false;
var containsWindowedObjects = false;

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

trace("ScrolLApp (chrome) content script loaded: " + document.URL);

function enableSmoothScroll(_enable, _reason) {
    // Get it into a JSON format
    // We'll use the same format over WebSocket
    chrome.extension.sendRequest({hiRes: _enable, reason: _reason});
}

// This is sent when the content receives a mousewheel event (capture phase)
document.addEventListener("mousewheel", function (e) {

    try
    {
        if (wheelProbing)
        {
            return;
        }

        trace("mousewheel: " + e);

        // Check and see if the event state has changed
        trace("    target: " + e.target);
        trace("    delta: " + e.wheelDelta);
        trace("    deltaMode: " + e.deltaMode);
        trace("    phase: " + e.eventPhase);

        var eventProbe = document.createEvent("MouseEvents");
        eventProbe.initEvent('mousewheel', true, true);
        eventProbe.wheelDelta = e.wheelDelta;

        wheelProbing = true;
        var dispatchResult = e.target.dispatchEvent(eventProbe);
        trace("    probe delta: " + eventProbe.wheelDelta);
        trace("    defaultPrevented: " + eventProbe.defaultPrevented);
        trace("    dispatchResult: " + dispatchResult);

        // Some objects return the defaultPrevented in the dispatch result
        // eg. memorabilia.hardrock.com (embedded silverlight)
        // Sme objects return the result on the event
        // Zoomable maps (eg. maps.google.com)
        if (eventProbe.defaultPrevented)
        {
            // Turn off hi-res
            enableSmoothScroll(false, "defaultPrevented");
        }
    }
    catch(aException)
    {
        trace_exception("mousewheel" + aException);
    }

    wheelProbing = false;

}, true);

// This is sent when the content receives a mousewheel event (bubble phase)
document.addEventListener("mousewheel", function (e) {
    
    try
    {
        trace("mousewheel: " + e);
       
        // Check and see if the event state has changed
        trace("    defaultPrevented: " + e.defaultPrevented);
        trace("    target: " + e.target);
        trace("    delta: " + e.wheelDelta);
        trace("    deltaMode: " + e.deltaMode);
        trace("    phase: " + e.eventPhase);
        
        var hasScrollBarInDocument = lookForScrollBarInDocument();
        var hasScrollBarInHtmlOrBody = lookForScrollBarInHtmlOrBody(e.target);
        var hasScrollBarInElement = lookForScrollBarInElement(e.target);
        var hasScrollBarInFrame = lookAtElementTypeForFrame(e.target);
         
        trace("    hasScrollBarInDocument: " + hasScrollBarInDocument);
        trace("    hasScrollBarInElement: " + hasScrollBarInElement);
        trace("    hasScrollBarInHtmlOrBody: " + hasScrollBarInHtmlOrBody);
        trace("    hasScrollBarInFrame: " + hasScrollBarInFrame);
        
         if(hasScrollBarInFrame || hasScrollBarInElement || hasScrollBarInHtmlOrBody || hasScrollBarInDocument)
         {
             trace("Document Has ScrollBar");

             if(e.defaultPrevented)
             {
                 //Turn OFF HiRes
                 trace("defaultPrevented was TRUE:Turning OFF HiRes");
                 enableSmoothScroll(false, "defaultPrevented");
             }
             else
             {
                 //Turn ON HiRes
                 enableSmoothScroll(true, "scrollbar");
             } 
         } 
         else
         {
             trace("No ScrollBar:Turning OFF HiRes");
             enableSmoothScroll(false, "no scrollbar");
         } 
      }
      
    catch(aException)
    {
        trace_exception("mousewheel" + aException);
    }

}, false);


// This is sent when the content receives a focus event
document.defaultView.addEventListener("focus", function (e) {
    try
    {
        // we don't do anything here
        trace("focus: " + e);
    }
    catch(aException)
    {
        trace_exception("focus" + aException);
    }
   }, true);


document.defaultView.addEventListener("blur", function (e) {
    trace("blur: " + e);
   }, true);

document.addEventListener("wheel", function (e) {
    trace("wheel: " + e);
}, false);


function refreshContent() {
    try
    {
        // Check for windowed objects (the ones that consume messages)
        containsWindowedObjects = lookForWindowedObjectsInDocument();
        if (containsWindowedObjects)
        {
            enableSmoothScroll(false, "content has windowed objects");
            return;
        }

        // Default is that hi-res is enabled on focus
        enableSmoothScroll(true, "content looks good for scrolling");
    }
    catch(aException)
    {
        trace_exception("refreshContent", aException);
    }
}

refreshContent();