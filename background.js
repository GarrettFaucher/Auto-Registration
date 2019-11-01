
console.log("PLUGIN")

chrome.browserAction.onClicked.addListener(function(tab) {
    alert('working?');
});
