/*
  tabDriver.js

  Drives the whole login/registration process by running automations
  at specific times, or when specific events occur.
*/

//Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Run function, starts each automation function and handles return values
function run(){
  //try login
  login();
  // TODO: check if login failed, if it did send a message to the popup window to alert the user
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

     chrome.storage.local.get(['username'], function(result) {
          console.log("Username: " + result.username);
          usernameInput.value = result.username;
     });

     chrome.storage.local.get(['password'], function(result) {
          console.log("Password: " + result.password);
          passwordInput.value = result.password;
     });

     console.log('Waiting for page to load...');
     await sleep(2000);
     console.log('Page should have loaded.');

     submitButton.click();

     await sleep(2000);
     console.log('Waiting log on...');
     if (loggedOn()) {
          console.log("User logged on.")
     }
}


// loggedOn returns a boolean value based on if the user has navigated past
// the webauth.uvm.edu/webauth/login page.
// Returns true if user has logged on
function loggedOn() {
     console.log("running checkLogin automation");
     // Element only on login page
     var element = document.getElementById("login-topcontainer");
     // If element is still on page user hasn't logged in
     if (typeof(element) != 'undefined' && element != null){
          console.log('User is not logged on');
          return false;
     } else {
          console.log('User is logged on');
          return true;
     }
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
    // If the received command is start
    if (request.command == "start")
      console.log('recieved start command')
      run();

    //send response back to background page, required every time a message is received or else this whole listener shits itsself
    sendResponse();
  });

}
main();
