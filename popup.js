//popup.js for javascript event handling and data saving on the popup.html page


//getCourseData converts a crn to courseName, totalEnrolled, totalSeats, and totalRemaining
async function getCourseData(crn){
  // $.get("https://giraffe.uvm.edu/~rgweb/batch/swrsectc_spring_soc_202001/all_sections.html", function(data, status){
  //   var regex = /<pre>([\s\S]*)<\/pre>/;
  //   var matched = regex.exec(data)[1];
  //   matched = matched.replace(/(>>>====>)(.*?)(<====<<<)/g,"");
  //   console.log(matched);
  // });
  var returnVal;
  await $.get("http://www.uvm.edu/academics/courses/?term=202001&crn="+crn, function(data,status){

    if(status != "success"){
      console.log(status)
      returnVal = false;
    }

    try {

      var courseNameRegex = /rel="displayInfoLink">(.*?)<\/a><\/h3>/g;
      var courseName = courseNameRegex.exec(data)[1];

      console.log("Course name for "+crn+" is "+decodeURI(courseName));

      var seatCountRegex = /Enrolled\/Seats:<\/span>(.*?)<br>/g;
      var seatCount = seatCountRegex.exec(data)[1];

      console.log("Seat Count for "+crn+" is "+seatCount);
      var seatDist = seatCount.split("/");
      var totalEnrolled = seatDist[0];
      var totalSeats = seatDist[1];
      var seatsRemaining = totalSeats - totalEnrolled;

      console.log("Total Enrolled: "+totalEnrolled);
      console.log("Total Seats: "+totalSeats);
      console.log("Seats Remaining: "+seatsRemaining);

      returnVal = {totalEnrolled: Number(totalEnrolled), totalSeats: Number(totalSeats), totalRemaining: seatsRemaining, courseName: courseName}

    } catch (e) {

      returnVal = false;

    }



  });

  return returnVal;
}

function updateAllCrnInfo(){
  console.log("running updateAllCrnInfo")
  $(".crnResolver").each(async function(){

    var newCrn = $('> input',this).val();
    if(newCrn){
      $('> input',this).removeClass("empty");
      console.log("Checking crn "+newCrn)
      var crnData = await getCourseData(newCrn);
      if(crnData){
        console.log("Found crndata for "+newCrn);
        console.log(crnData);
        $('> .crnInfo',this).html(crnData.courseName);
        $('> .crnInfo',this).removeClass('warning');
      }
      else{
        console.log("No crndata for "+newCrn);
        $('> .crnInfo',this).html("Invalid CRN");
        $('> .crnInfo',this).addClass('warning');
      }
    }
    else{
      $('> input',this).addClass("empty");
      $('> .crnInfo',this).removeClass("")
    }


  });
}

// When save is clicked on popup.html, collectData is called.
window.addEventListener('load', function load(event){
    fillData();
    setTimeout(function(){
      updateAllCrnInfo();
    }, 500);

    document.getElementById('dataForm').addEventListener('change', function() {
        collectData();
        updateAllCrnInfo();
    });






    // var saveButton = document.getElementById('save');
    // saveButton.addEventListener('click', function() {
    //      collectData();
    //      saveButton.value = "Saved";
    // });

    //listen for clicks on the "run" button
    var runButton = document.getElementById('run');
    runButton.addEventListener('click', event => {
      //when a click is detected, send a message to the background page
      console.log('sending click event to background page')
      chrome.runtime.sendMessage({event: 'runClick'}, function(response){

      });

    });
});


//fillData fills the form with data previously saved by the user
function fillData(){
  // Store the data from each textbox
  var username = document.getElementById('username');
  var password = document.getElementById('password');
  var date = document.getElementById('reg_date'); // Date stored in format YYYY-MM-DD
  // Possible values for time: 600am, 630am, 700am
  var time = document.getElementById('reg_time');
  var crn_1 = document.getElementById('crn_1');
  var crn_2 = document.getElementById('crn_2');
  var crn_3 = document.getElementById('crn_3');
  var crn_4 = document.getElementById('crn_4');
  var crn_5 = document.getElementById('crn_5');
  var crn_6 = document.getElementById('crn_6');
  var crn_7 = document.getElementById('crn_7');
  var crn_8 = document.getElementById('crn_8');

  chrome.storage.local.get(['username'], function(result) { username.value = result.username; });
  chrome.storage.local.get(['password'], function(result) { password.value = result.password; });
  chrome.storage.local.get(['date'], function(result) { date.value = result.date; });
  chrome.storage.local.get(['time'], function(result) { time.value = result.time; });
  chrome.storage.local.get(['crn_1'], function(result) { crn_1.value = result.crn_1; });
  chrome.storage.local.get(['crn_2'], function(result) { crn_2.value = result.crn_2; });
  chrome.storage.local.get(['crn_3'], function(result) { crn_3.value = result.crn_3; });
  chrome.storage.local.get(['crn_4'], function(result) { crn_4.value = result.crn_4; });
  chrome.storage.local.get(['crn_5'], function(result) { crn_5.value = result.crn_5; });
  chrome.storage.local.get(['crn_6'], function(result) { crn_6.value = result.crn_6; });
  chrome.storage.local.get(['crn_7'], function(result) { crn_7.value = result.crn_7; });
  chrome.storage.local.get(['crn_8'], function(result) { crn_8.value = result.crn_8; });

}

// collectData retrieves the filled in text boxes from the HTML display and
// populate input.json with the data gathered.
function collectData() {
     console.log("collectData called.");

     // Clear local storage
     chrome.storage.local.clear(function() {
          var error = chrome.runtime.lastError;
          if (error) {
               console.error(error);
          }
     });

     // Store the data from each textbox
     var username = document.getElementById('username').value;
     var password = document.getElementById('password').value;
     var date = document.getElementById('reg_date').value; // Date stored in format YYYY-MM-DD
     // Possible values for time: 600am, 630am, 700am
     var time = document.getElementById('reg_time').value;
     var crn_1 = document.getElementById('crn_1').value;
     var crn_2 = document.getElementById('crn_2').value;
     var crn_3 = document.getElementById('crn_3').value;
     var crn_4 = document.getElementById('crn_4').value;
     var crn_5 = document.getElementById('crn_5').value;
     var crn_6 = document.getElementById('crn_6').value;
     var crn_7 = document.getElementById('crn_7').value;
     var crn_8 = document.getElementById('crn_8').value;

     var crnData = [username, password, date, time, crn_1, crn_2, crn_3, crn_4, crn_5, crn_6, crn_7, crn_8];
     console.log(crnData); // Show the data for bug fixing

     chrome.storage.local.set({'username': username});
     chrome.storage.local.set({'password': password});
     chrome.storage.local.set({'date': date});
     chrome.storage.local.set({'time': time});
     chrome.storage.local.set({'crn_1': crn_1});
     chrome.storage.local.set({'crn_2': crn_2});
     chrome.storage.local.set({'crn_3': crn_3});
     chrome.storage.local.set({'crn_4': crn_4});
     chrome.storage.local.set({'crn_5': crn_5});
     chrome.storage.local.set({'crn_6': crn_6});
     chrome.storage.local.set({'crn_7': crn_7});
     chrome.storage.local.set({'crn_8': crn_8});
}
