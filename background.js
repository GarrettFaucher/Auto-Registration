// background.js runs continually in the background of our extension
// and is not limited to the scope of the popup, and does not depend on the popup being visible

//globals
var nextCommand;
var refreshInterval = 3000;
var quickRefresh = 50;


//sends a command to our spawned tab (created with spawnTab)
function sendCommand(newCommand){
  //get listing of tabs
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      //send a message to the active tab with given command
      //the active tab should be myuvm.uvm.edu since we just created that with spawnTab
      //this tab will have tabDriver injected into it, so it will be waiting for a command
      chrome.tabs.sendMessage(tabs[0].id, {command: newCommand}, function(response) {});
  });
}


//spawnTab is called when the "Run" button is clicked in the popup
//function is executed when our listener detects "runClick" event sent by popup.js
function spawnTab(){
  console.log("Run button was clicked, beginning spawnTab()")
  chrome.tabs.create({
    url: 'https://aisweb1.uvm.edu/pls/owa_prod/bwskfreg.P_AddDropCrse'
  }, function(tab){


    // //once the tab is created, but not neccesarily loaded
    // console.log("tab created, waiting 2 seconds to start tabDriver")
    //
    // //set a timeout to execute start command after 2 seconds
    // setTimeout(function(){
    //   console.log("Firing up tabDriver")
    // },2000);

  });
}

//HANDLE INCOMING MESSAGES
function handleMessage(request){
  console.log("NEXT COMMAND: "+nextCommand);

  //incoming messages from popup.js (message contains an event)
  if (request.event){
    switch (request.event) {
      case 'runClick':
        console.log("login automation queued")
        nextCommand = "login";
        spawnTab();
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
        }
        else {
          console.log('waitForRegStatus failed')
          setTimeout(function() {
            nextCommand = "waitForRegStatus";
            sendCommand(nextCommand);
            nextCommand = "";
            if (refreshInterval != quickRefresh) {
              checkTime();
            }
          }, refreshInterval);
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

function checkTime() {
  // TODO: Check if close to reg time.
  // var registrationTime;
  // chrome.storage.local.get(['reg_time'], function(result) {
  //      registrationTime = result.reg_time;
  // });
  // console.log(registrationTime);
}
