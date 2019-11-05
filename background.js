// background.js runs continually in the background of our extension
// and is not limited to the scope of the popup, and does not depend on the popup being visible

//runClick is called when the "Run" button is clicked in the popup
//function is executed when our listener detects "runClick" event sent by popup.js
function runClick(){
  console.log("Run button was clicked, beginning runClick()")
  chrome.tabs.create({
    url: 'http://myuvm.uvm.edu'
  }, function(tab){
    //once the tab is created, but not neccesarily loaded
    console.log("tab created, waiting 2 seconds to start tabDriver")

    //set a timeout to execute start command after 2 seconds
    setTimeout(function(){
      console.log("Firing up tabDriver")
      //get listing of tabs
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          //send a message to the active tab with command = start
          //the active tab should be myuvm.uvm.edu since we just created that
          //this tab will have tabDriver injected into it, so it will be waiting for a command
          chrome.tabs.sendMessage(tabs[0].id, {command: "start"}, function(response) {});
      });
    },2000);

  });
}

// Listen for incoming messages from the popup javascript file
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  if (request.event == "runClick")
    runClick();
});
