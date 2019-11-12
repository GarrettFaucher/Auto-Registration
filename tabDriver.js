/*
  tabDriver.js

  Drives the whole login/registration process by running automations
  at specific times, or when specific events occur.
*/

// globals
var preLoggedOn = false; // Indicates whether the user is already logged in to UVM

//Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//Sends a response to background.js in reference to an automation
//This function is used to send the return value of an automation
function respondToBackground(automationName, returnVal){
  console.log('Automation '+automationName+' is responding to background.js with returnVal: '+returnVal);
  chrome.runtime.sendMessage({automation: automationName, success: returnVal}, function(response) {});
}

//Sends driverReady to background.js, so that it knows when to execute the next command
function broadcastReady(){
  console.log('Broadcasting driverReady to background.js');
  chrome.runtime.sendMessage({driverReady: true});
}

/*
AUTOMATIONS

Each automation runs a stage of the process and returns true if it succeeded, or false if it failed.
Return values are handled by start()

*/
async function login() {
  console.log("running login automation");

  if (!loggedOn()) {
    var usernameInput = document.getElementsByName("sid")[0];
    var passwordInput = document.getElementsByName("PIN")[0];
    var submitButton = document.querySelectorAll('[value="Login"]')[0];

    chrome.storage.local.get(['username'], function(result) {
      usernameInput.value = result.username;
    });

    chrome.storage.local.get(['password'], function(result) {
      passwordInput.value = result.password;
    });

    console.log('Waiting for page to load...');
    await sleep(2000);
    console.log('Page should have loaded.');

    submitButton.click();
    return true;
  } else {
    preLoggedOn = true;
    return false;
  }
}


// loggedOn returns a boolean value based on if the user has navigated past
// the webauth.uvm.edu/webauth/login page.
// Returns true if user has logged on
function loggedOn() {
  console.log("running loggedOn automation");
  // Element only on login page
  var element = document.querySelectorAll('[href="http://www.uvm.edu/registrar/Luminis/password_help_form.html"]')[0];
  // If element is still on page user hasn't logged in
  if (typeof(element) != 'undefined' && element != null){
    console.log('User is not logged on');
    return false;
  } else {
    console.log('User is logged on');
    return true;
  }
}

// navigateToRegistrar is called once the user has been logged on
async function navigateToRegistrar() {
  console.log("running navigateToRegistrar automation");
  var regButton = document.querySelectorAll('[href="/pls/owa_prod/twbkwbis.P_GenMenu?name=bmenu.P_RegMnu"]')[0];
  regButton.click();
  return true;
}

// navigateToButton is called once the user has navigated to registrar page
async function navigateToAddDrop() {
  console.log("running navigateToAddDrop automation");
  var addDropButton = document.querySelectorAll('[href="/pls/owa_prod/bwskfreg.P_AltPin"]')[0];
  addDropButton.click();
  return true;
}

// selectSubmit is called once the user has navigated to registrar page
async function selectSubmit() {
  console.log("running selectSubmit automation");
  var submitButton = document.querySelectorAll('[value="Submit"]')[0];
  submitButton.click();
  return true;
}

async function waitForRegStatus() {
  console.log("running waitForRegStatus automation");
  // Element only on invalid reg page
  var element = document.querySelectorAll('[href="bwskfreg.P_AddDropCrse"]')[0];
  // If element is still on page user hasn't logged in
  if (typeof(element) != 'undefined' && element != null){
    console.log('Reg closed');
    // TODO: Uncomment and remove for release
    await window.location.assign('http://gfaucher.w3.uvm.edu/Add_Drop_Withdraw%20Classes_.htm'); // REMOVE
    return true; // REMOVE
    // window.location.reload(); // Reload the page
    // return false;
  } else {
    console.log('Reg ready');
    return true;
  }
}

// register fills text boxes with CRN first choice data and clicks submit
async function register() {
  console.log("running register automation");

  var classesToRegFor = await new Promise((resolve,reject) => {
    chrome.storage.local.get(['crnAB'], function(result){
      console.log("local storage for classesToRegFor:")
      console.log(result.crnAB);
      resolve(result.crnAB);
    });
  });

  // Register for classes
  var crnSlot1 = document.getElementById('crn_id1');
  var crnSlot2 = document.getElementById('crn_id2');
  var crnSlot3 = document.getElementById('crn_id3');
  var crnSlot4 = document.getElementById('crn_id4');
  var crnSlot5 = document.getElementById('crn_id5');
  var crnSlot6 = document.getElementById('crn_id6');
  var crnSlot7 = document.getElementById('crn_id7');
  var crnSlot8 = document.getElementById('crn_id8');

  var crnSlots = [crnSlot1, crnSlot2, crnSlot3, crnSlot4, crnSlot5, crnSlot6, crnSlot7, crnSlot8];
  for (var i = 0; crnSlots.length > i; i++) {
    if(classesToRegFor[i] != undefined) {
      crnSlots[i].value = classesToRegFor[i];
    }
  }

  var regButton = document.querySelectorAll('[value="Submit Changes"]')[0];
  // TODO: Uncomment for release
  // regButton.click(); // Comment me out for testing purposes

  return true;
}

// registerSecond registers for backup CRNs
async function registerSecond() {
  console.log("running registerSecond automation");
  // Check success of first round of registration
  var crnElements = document.getElementsByName("CRN_IN");
  var crnRegistered = [];
  for (var i = 1; crnElements.length-10 > i; i++) {
    crnRegistered.push(crnElements[i].value);
  }
  chrome.storage.local.set({'crnRegistered': crnRegistered}); // Stores CRNs that have been registered for
  console.log("The CRN's that were registered for are: " + crnRegistered);
  // Done checking success

  // Determine backups to register for
  var crnAB = await new Promise((resolve,reject) => {
    chrome.storage.local.get(['crnAB'], function(result){
      console.log("local storage for crnAB:")
      console.log(result.crnAB);
      resolve(result.crnAB);
    });
  });

  var backupsToRegFor = [];
  // Loop through CRN A to see if they were registered for
  for(var i = 0; 8 > i; i++) {
    var didReg = false; // Boolean to flag if course has been registered for
    for(var j = 0; crnRegistered.length > j; j++) {
      // If crnAB is found in registered crns we mark it as registered
      // also if it is a blank box we mark it as registered
      if(crnAB[i] == crnRegistered[j] || crnAB[i] == "") {
        didReg = true;
      }
    }
    // If we havent flagged it as registered, we add the backup to backupsToRegFor
    if (!didReg) {
      backupsToRegFor.push(crnAB[i+8]);
    }
  }

  console.log(backupsToRegFor);

  // Register for backups
  var crnSlot1 = document.getElementById('crn_id1');
  var crnSlot2 = document.getElementById('crn_id2');
  var crnSlot3 = document.getElementById('crn_id3');
  var crnSlot4 = document.getElementById('crn_id4');
  var crnSlot5 = document.getElementById('crn_id5');
  var crnSlot6 = document.getElementById('crn_id6');
  var crnSlot7 = document.getElementById('crn_id7');
  var crnSlot8 = document.getElementById('crn_id8');

  var crnSlots = [crnSlot1, crnSlot2, crnSlot3, crnSlot4, crnSlot5, crnSlot6, crnSlot7, crnSlot8];
  for (var i = 0; crnSlots.length > i; i++) {
    if(backupsToRegFor[i] != undefined) {
      crnSlots[i].value = backupsToRegFor[i];
    }
  }

  var regButton = document.querySelectorAll('[value="Submit Changes"]')[0];
  // TODO: Uncomment for release
  // regButton.click();

  return true;
}

// handleCommand handles incoming messages from background.js to
// run automations and send back the responses via respondToBackground
async function handleCommand(request){
  console.log('running automation: '+request.command);
  switch (request.command){
    case 'login':
      var returnVal = await login();
      respondToBackground(request.command, returnVal);
      if (preLoggedOn) {
          broadcastReady();
      }
      break;
    case 'checkLogin':
      var returnVal = await loggedOn();
      respondToBackground(request.command, returnVal);
      // broadcastReady(); // Unneeded
      break;
    case 'navigateToRegistrar':
      var returnVal = await navigateToRegistrar();
      respondToBackground(request.command, returnVal);
      break;
    case 'navigateToAddDrop':
     var returnVal = await navigateToAddDrop();
     respondToBackground(request.command, returnVal);
     break;
    case 'selectSubmit':
      var returnVal = await selectSubmit();
      respondToBackground(request.command, returnVal);
      break;
    case 'waitForRegStatus':
      var returnVal = await waitForRegStatus();
      respondToBackground(request.command, returnVal);
      break;
    case 'register':
      var returnVal = await register();
      respondToBackground(request.command, returnVal);
      break;
    case 'registerSecond':
      var returnVal = await registerSecond();
      respondToBackground(request.command, returnVal);
      break;
    default:
      break;

  }
}


// Main function runs when the program is run
// This function is what is injected into every *.uvm.edu page.
// The function waits for specific commands from the background page,
// and does things on the UVM page based on those commands
function main(){
  //logs in this file can be seen on the UVM page's console - doesn't log to normal background page
  console.log("TABDRIVER: driver is ready");
  broadcastReady();

  // Create a message listener to listen for messages from background.js
  chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    sendResponse();
    handleCommand(request);
  });

}
main();
