chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({crn_1: ''}, function() {
   console.log("CRNs Clear");
  });
});
