function getCurrentTabUrl(callback) {
    var trackEventArray = ["boomerangtheweb", "icon clicked"]
    chrome.runtime.sendMessage({greeting: "track_event", data: trackEventArray});
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, function(tabs) {
        var tab = tabs[0];
        var url = tab.url;
        var title = tab.title;
        callback(url, title);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    getCurrentTabUrl(function(currentUrl, currentTitle){
        var tabUrl = 
            "https://mail.google.com/mail/?view=cm&fs=1&tf=1"
            + "&su=" + encodeURIComponent(currentTitle)
            + "&body=" + encodeURIComponent(currentUrl)
            + "&boomerangtheweb=1";
        chrome.tabs.create({"url": tabUrl})
    });
});
