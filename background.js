// background.js runs continually in the background of our extension
// and is not limited to the scope of the popup, and does not depend on the popup being visible

//globals
var nextCommand;
var workingTab; // Stores tab besing used by program
var refreshInterval = 3000; // Slow page reload interval
var quickRefresh = 3000; // Quick page reload interval

//Sleep function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//sends a command to our spawned tab (created with spawnTab)
function sendCommand(newCommand){
  //send a message to the active tab with given command
  //this tab will have tabDriver injected into it, so it will be waiting for a command
  chrome.tabs.sendMessage(workingTab.id, {command: newCommand}, function(response) {});
}

// Checks if it is time to start refreshing quickly.
async function timeToSpawn() {
  var regTime;
  var regDate;

  var regTime = await new Promise((resolve,reject) => {
    chrome.storage.local.get(['time'], function(result) {
      resolve(result.time);
    });
  });

  var regDate = await new Promise((resolve,reject) => {
    chrome.storage.local.get(['date'], function(result) {
      resolve(result.date);
    });
  });

  var data = await new Promise((resolve,reject) => {
    $.getJSON("http://worldclockapi.com/api/json/est/now", function(response) {
      resolve(response);
    });
  });

  var atomDate = data.currentDateTime.slice(0,10);
  var atomTime = data.currentDateTime.slice(11,16);

  if (regTime == '600am') {regTime = '05:55';}
  else if (regTime == '630am') {regTime = '06:25';}
  else if (regTime == '700am') {regTime = '06:55';}
  else if (regTime == 'n_a') {regTime = atomTime;}

  regTime.replace(":","");
  atomTime.replace(":","");

  console.log("Atom: " + atomDate + "\nReg: " + regDate + "\nAtom: " + atomTime + "\nReg: " + regTime);
  console.log("Evaluating as: " + (regDate <= atomDate) && (regTime <= atomTime));

  if ((regDate <= atomDate) && (regTime <= atomTime)) {
    console.log("timeToSpawn");
    return true;
  } else {
    console.log("!timeToSpawn")
    return false;
  }
}

//spawnTab is called when the "Run" button is clicked in the popup
//function is executed when our listener detects "runClick" event sent by popup.js
async function spawnTab(){
  chrome.power.requestKeepAwake("display");
  chrome.power.requestKeepAwake("system");
  console.log("Run button was clicked, beginning spawnTab()");
  var createTab = function () {
    chrome.tabs.create({
      url: 'https://aisweb1.uvm.edu/pls/owa_prod/bwskfreg.P_AddDropCrse'
    }, function(tab){
      workingTab = tab; // Setting the newly made tab to a global to be used later
    });
  }
  while(true) {
    console.log("entered while loop")
    var returnData = await timeToSpawn();
    console.log("Time to spawn returned ");
    console.log(returnData);
    if(returnData) {
      console.log("entered break");
      break;
    } else {
      console.log("Not time yet, sleeping for 30")
      await sleep(30000);
    }
  }
  chrome.browsingData.remove({
        "origins": ["http://*.uvm.edu/*","https://*.uvm.edu/*"]
      }, {
        // "appcache": true,
        // "cache": true,
        //"cacheStorage": true,
        "cookies": true
      }, createTab);
}

async function spawnTabTest(){
  console.log("Test button was clicked, beginning spawnTabTest()");
  var createTab = function () {
    chrome.tabs.create({
      url: 'https://aisweb1.uvm.edu/pls/owa_prod/bwskfreg.P_AddDropCrse'
    }, function(tab){
      workingTab = tab; // Setting the newly made tab to a global to be used later
    });
  }
  chrome.browsingData.remove({
        "origins": ["http://*.uvm.edu/*","https://*.uvm.edu/*"]
      }, {
        // "appcache": true,
        // "cache": true,
        // "cacheStorage": true,
        "cookies": true
      }, createTab);
}

//HANDLE INCOMING MESSAGES
async function handleMessage(request){
  console.log("recieved request:")
  console.log(request);
  console.log("NEXT COMMAND: "+nextCommand);

  //incoming messages from popup.js (message contains an event)
  if (request.event){
    switch (request.event) {
      case 'runClick':
        console.log("login automation queued")
        nextCommand = "login";
        spawnTab();
        break;
      case 'testClick':
        console.log("loginTest automation queued")
        nextCommand = "loginTest";
        spawnTabTest();
        break;
      default:
        break;

    }
  }

  //incoming messages from background.js (message contains an automation and boolean success)
  if(request.automation){
    switch (request.automation) {
      case 'login':
        if(request.success){
          console.log('login automation complete, queuing checkLogin automation')
          nextCommand = "checkLogin";
        }
        else {
          console.log("User already logged on, progressing to waitForRegStatus")
          nextCommand = "waitForRegStatus";
        }

        break;
      case 'checkLogin':
        if(request.success){
          console.log('checkLogin automation complete')
          nextCommand = "navigateToRegistrar";
        }
        else {
          console.log('checkLogin failed')
        }
        break;
      case 'navigateToRegistrar':
        if(request.success){
          console.log('navigateToRegistrar automation complete')
          nextCommand = "navigateToAddDrop";
        }
        else {
          console.log('checkLogin failed')
        }
        break;
      case 'navigateToAddDrop':
        if(request.success){
          console.log('navigateToAddDrop automation complete')
          nextCommand = "selectSubmit";
        }
        else {
          console.log('navigateToAddDrop failed')
        }
        break;
      case 'selectSubmit':
        if(request.success){
          console.log('selectSubmit automation complete')
          nextCommand = "waitForRegStatus";
        }
        else {
          console.log('navigateToAddDrop failed')
        }
        break;
      case 'waitForRegStatus':
        if(request.success){
          console.log('waitForRegStatus automation complete')
          nextCommand = "register";
          sendCommand(nextCommand);
          nextCommand = "";
        }
        else {
          console.log('waitForRegStatus failed')
          nextCommand = "waitForRegStatus";
          await sleep(refreshInterval);
          console.log(refreshInterval);
          if (refreshInterval != quickRefresh) {
              checkRegClose();
          }
        }
        break;
      case 'register':
        if(request.success){
          console.log('register automation complete')
          nextCommand = "registerSecond";
        }
        else {
          console.log('register failed')
        }
        break;
      case 'registerSecond':
        if(request.success){
          console.log('registerSecond automation complete')
          nextCommand = "";
        }
        else {
          console.log('registerSecond failed')
        }
        break;

      /* TEST CLICK CASES */
      case 'loginTest':
        if(request.success){
          console.log('loginTest automation complete, queuing checkLogin automation')
          nextCommand = "checkLoginTest";
        }
        else {
          console.log("User already logged on, progressing to waitForRegStatus")
          nextCommand = "waitForRegStatus";
        }

        break;
      case 'checkLoginTest':
        if(request.success){
          console.log('checkLoginTest automation complete')
          nextCommand = "navigateToRegistrarTest";
        }
        else {
          console.log('checkLogin failed')
        }
        break;
      case 'navigateToRegistrarTest':
        if(request.success){
          console.log('navigateToRegistrarTest automation complete')
          nextCommand = "navigateToAddDropTest";
        }
        else {
          console.log('checkLoginTest failed')
        }
        break;
      case 'navigateToAddDropTest':
        if(request.success){
          console.log('navigateToAddDropTest automation complete')
          nextCommand = "selectSubmitTest";
        }
        else {
          console.log('navigateToAddDropTest failed')
        }
        break;
      case 'selectSubmitTest':
        if(request.success){
          console.log('selectSubmitTest automation complete')
          nextCommand = "closeTest";
        }
        else {
          console.log('navigateToAddDropTest failed')
        }
        break;

      default:
        break;
    }
  }

  //if driverReady was received from tabDriver.js, this means that the page loaded and the driver is ready for the next command
  if(request.driverReady && nextCommand != "" && nextCommand != null){
    console.log("Received driverReady, queued command: "+nextCommand)
    sendCommand(nextCommand);
    nextCommand = "";
  }
}



//message listener, passes message requests to handleMessage
chrome.runtime.onMessage.addListener(
function(request, sender, sendResponse) {
  sendResponse();
  handleMessage(request);
});


// Checks if it is time to start refreshing quickly.
async function checkRegClose() {
  var regTime;
  var regDate;
  await chrome.storage.local.get(['time'], function(result) {
    regTime = result.time;
  });
  await chrome.storage.local.get(['date'], function(result) {
    regDate = result.date;
  });

  var data;
  await $.getJSON("http://worldclockapi.com/api/json/est/now", function(response) {
    data = response;
  });

  var atomDate = data.currentDateTime.slice(0,10);
  var atomTime = data.currentDateTime.slice(11,16);

  if (regTime == '600am') {regTime = '05:59';}
  else if (regTime == '630am') {regTime = '06:29';}
  else if (regTime == '700am') {regTime = '06:59';}
  else if (regTime == 'n_a') {regTime = atomTime;}

  console.log(regDate + " and " + atomDate);
  console.log(regTime + " and " + atomTime);

  if ((regDate <= atomDate) && (regTime <= atomTime)) {
    refreshInterval = quickRefresh;
  }
}
