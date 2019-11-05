/*
  tabDriver.js

  Drives the whole login/registration process by running automations
  at specific times, or when specific events occur.

  Controls tabs, script injections, and reads information such as URL changes / page changes

  All automations are stored in /automations

  Calling this file automatically begins the course registration process
*/


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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


function driver(){
  console.log("TABDRIVER: driver is active - waiting for commands");
  var tabId;

  //
  // COMMANDS
  // Commands are sent from other scripts in the extension with access to the chrome API
  //

  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    // console.log(request);
    if (request.command == "start")
      console.log('recieved start command')
      login()
    console.log("sending response")
    sendResponse();
  });

  // chrome.tabs.create({
  //   url: 'http://myuvm.uvm.edu'
  // }, function(tab){
  //   tabId = tab.id;
  //   console.log('tab created');
  //   setTimeout(function(){
  //     chrome.tabs.executeScript(tabId, {file: './automations/login.js'},function(){
  //       console.log('script execution');
  //     })
  //   }, 1000);
  //
  // });




  //Attempt login with login.js

  //Run checkLogin.js

  //if logged in, navigate to registrar page

  //at specific time, run entryAttempt.js to try to get into course registration

  //when registration page url is detected, run classSignup.js to autofill CRNS and submit the form
}
driver();
