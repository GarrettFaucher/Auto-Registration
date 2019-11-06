/*
  tabDriver.js

  Drives the whole login/registration process by running automations
  at specific times, or when specific events occur.
*/

//Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*
AUTOMATIONS

Each automation runs a stage of the process and returns true if it succeeded, or false if it failed.
Return values are handled by start()

*/
async function login() {
     console.log("running login automation");

     var usernameInput = document.getElementsByName("username")[0];
     var passwordInput = document.getElementsByName("password")[0];
     var submitButton = document.getElementsByName("submit")[0];

     chrome.storage.sync.get(['username'], function(result) {
          console.log(result);
    });

    chrome.storage.sync.get(['password'], function(result) {
         console.log(result);
   });

     // TODO: Use chrome.local data to fill properly
     usernameInput.value="username";
     passwordInput.value="password";

     console.log('Waiting for page to load...');
     await sleep(2000);
     console.log('Page should have loaded.');
     // submitButton.click();

}

// Main function runs when the program is run
// This function is what is injected into every *.uvm.edu page.
// The function waits for specific commands from the background page,
// and does things on the UVM page based on those commands
function main(){
  //logs in this file can be seen on the UVM page's console - doesn't log to normal background page
  console.log("TABDRIVER: driver is active - waiting for commands");
  var tabId;

  // Create a message listener to listen for messages from background.js
  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    switch (request.command) {
      case 'start':
        console.log('running automation: login')
        var returnVal = login();
        sendResponse({success: returnVal});
        break;

      default:
        break;

    }
  });

}
main();
