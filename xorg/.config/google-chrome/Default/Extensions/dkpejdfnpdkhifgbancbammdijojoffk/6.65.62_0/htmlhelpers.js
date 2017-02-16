/*****************************************
 * Helper functions shared in Extensions *
 *****************************************/

var localTrace = function(s) {
    // to redefine in your scripts
}

var enableTrace = false;

var trace = function(s) {
    if (enableTrace) {
        localTrace(s);
    }
}

var trace_exception = function(s, e) {
    trace(s + ": (" + e + ")");
}


function lookAtElementTypeForFrame(elem) {
    return ((elem.tagName == "IFRAME") || (elem.tagName == "FRAME"));
}

function lookAtActiveElementForDropdownListbox(elem) {
    // TODO: Check if the dropdown is open or not
    // The way to do this is check if the element is <option>
    return (elem.tagName == "OPTION")
}

// Looks for scroll bar in content document
// Content document always contains the top most HTML
function lookForScrollBarInDocument() {

    var html = document.documentElement;
    if (html) {
        return (html.scrollHeight > html.clientHeight)
    }
    else {
        trace(" *** COULD NOT FIND HTML?? \n");
        return false;
    }
}

function lookForScrollBarInHtmlOrBody(elem) {

  trace("lookForScrollBarInHtmlOrBody\n");
    
  // Traverse up the element tree until we get to the top element
  while(elem)
  {
      var isBody = (elem.tagName == "BODY");
      var isHtml = (elem.tagName == "HTML");
      var scrollHeight = 0;
      var clientHeight = 0;
      var isHidden = false;

      if (elem.style && elem.style.overflow)
      {
          isHidden = ("hidden") == elem.style.overflow
      }
      if (elem.style && elem.style.overflowY)
      {
          isHidden = ("hidden" == elem.style.overflowY);
      }

      if ( (isBody || isHtml) && !isHidden )
      {
          if (elem.scrollHeight > elem.clientHeight)
          {
              // if more content than window size, we have a scroll bar
              trace("    has visible, working scrollbar\n");
              return true;
          }
      }

      // Get the parent
      elem = elem.parentNode;
  }

  return false;
}

function lookForScrollBarInElement(elem) {

    trace("lookForScrollBarInElement\n");

    // Traverse up the element tree until we get to the top element
    while (elem) {
        var isBody = (elem.tagName == "BODY");
        var isHtml = (elem.tagName == "HTML");
        var scrollHeight = 0;
        var clientHeight = 0;
        var ovAuto = false;
        var ovScroll = false;
        var isHidden = false;

        //trace("    " + elem.tagName);
        if (elem.style) {
            //trace("        style: " + "available");
            if (elem.style.overflow) {
                trace("        overflow: " + elem.style.overflow);
                ovAuto = ("auto" == elem.style.overflow);
                ovScroll = ("scroll" == elem.style.overflow);
                isHidden = ("hidden" == elem.style.overflow);
            }
            else {
                //trace("        overflow: " + "none");
            }

            if (elem.style.overflowY) {
                //trace("        overflowY: " + elem.style.overflowY);
                ovAuto = ("auto" == elem.style.overflowY);
                ovScroll = ("scroll" == elem.style.overflowY);
                isHidden = ("hidden" == elem.style.overflowY);
            }
            else {
                //trace("        overflowY: " + "none");
            }
        }
        else {
            //trace("        style: " + "none");
        }

        //trace("        scrollHeight: " + elem.scrollHeight);
        //trace("        clientHeight: " + elem.clientHeight);
        //trace("        isHidden: " + isHidden);

        if (isHidden) {
            // Go no further
            //trace("    has hidden scrollbar");
            return false;
        }

        // Ignore the overflow
        if ((!isBody && !isHtml) && !isHidden) {
            if (0 == elem.clientHeight) {
                // an element with a 0 client height does not trigger a scroll bar
            }
            else if (elem.scrollHeight > elem.clientHeight) {
                // if more content than window size, we have a scroll bar
                //trace("    has visible, working scrollbar");
                return true;
            }
        }

        // Get the parent
        elem = elem.parentNode;
    }

    return false;
}

function isWindowedSilverlightObject(elem) {
    try {
        // Get the type
        var silverlightMime = "application/x-silverlight-2";
        // Enumerate the PARAM items
        var params = elem.getElementsByTagName("PARAM");
        for (var i = 0; i < params.length; i++) {
            // Get the name/value pair
            var name = params[i].getAttribute("name");
            var value = params[i].getAttribute("value");
            if ((name == "windowless") && (value == "false")) {
                return true;
            }
        }
        return false;
    }
    catch (aException) {
        trace_exception("isWindowedSilverlightObject", aException);
    }
    return false;
}

function lookForWindowedObjectsInDocument() {
    // Look for any windowed objects
    var objects = document.getElementsByTagName("OBJECT");
    for (var i = 0; i < objects.length; i++) {
        // Silverlight
        if (isWindowedSilverlightObject(objects[i])) {
            // Page contains windows silverlight. Turn off hi-res
            // Because we're unsure if we are over the object
            return true;
        }
    }
    return false;
}