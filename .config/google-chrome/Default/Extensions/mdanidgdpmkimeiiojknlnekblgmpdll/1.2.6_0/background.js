var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-8959903-5']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.greeting == "uninstall_old_extension"){
        //uninstall pre-Chrome Web Store version of Boomerang for Gmail
        chrome.management.uninstall("mdkdbdadolokifeomchamhifddohomii");
    }
    else if (request.greeting == "list_extensions"){
        //asynchronously get a list of all Chrome extensions for debugging purposes
        chrome.management.getAll(function(extensions){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {greeting: "extensions", extensions: extensions}, function(response) {
              });
            });
        });
    }
    else if (request.greeting == "track_event"){
      // Submit a Google Analytics event
      var data = request.data; // in the form ["category", "action", "label" (optional)]
      var eventArray = ["_trackEvent"];
      for (var i = 0; i < data.length; i++)  {
        eventArray.push(data[i]);
      }
      _gaq.push(eventArray);
    }
});



