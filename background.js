function runClick(){
  console.log("running runclick")
  chrome.tabs.create({
    url: 'http://myuvm.uvm.edu'
  }, function(tab){
    //send message saying to start
    console.log("tab created, waiting 2 seconds to send command")
    setTimeout(function(){
      console.log("sending start command to driver")
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id, {command: "start"}, function(response) {});
      });
    },2000);

  });
}

chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  if (request.event == "runClick")
    runClick();
});
