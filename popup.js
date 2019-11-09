//popup.js for javascript event handling and data saving on the popup.html page

var crnCache = [];
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

function updateAllCrnInfo(updateChangedOnly){
  console.log("running updateAllCrnInfo")
  var index = -1;
  console.log(crnCache);
  $(".crnResolver").each(async function(){
    index+=1;
    var newCrn = $('> input',this).val();
    console.log("previous crn "+crnCache[index]+", new crn: "+newCrn);
    console.log("updateChangedOnly: "+updateChangedOnly+", cache:"+crnCache[index]+" new:"+newCrn+", index:"+index);
    if((updateChangedOnly && crnCache[index]!=newCrn) || (!updateChangedOnly)){


      crnCache[index] = newCrn;

      $('> .crnSeatInfo',this).hide();
      $('> input',this).removeClass("empty");
      $('> input',this).removeClass("valid");
      $('> .crnInfo',this).removeClass('warning');
      $('> .crnSeatInfo',this).removeClass("danger");

      if(newCrn){
        console.log("Checking crn "+newCrn)
        var crnData = await getCourseData(newCrn);
        if(crnData){
          console.log("Found crndata for "+newCrn);
          console.log(crnData);
          $('> input',this).addClass("valid");
          $('> .crnInfo',this).html(crnData.courseName);
          $('> .crnSeatInfo',this).show();

          if(crnData.totalRemaining < 1){
            console.log(crnData.courseName+" is full");
            $('> .crnSeatInfo',this).removeClass("fa-user-check");
            $('> .crnSeatInfo > .fas',this).addClass("fa-user-slash");
            $('> .crnSeatInfo',this).addClass("danger");

          }
          else{
            console.log(crnData.courseName+" is not full");
            $('> .crnSeatInfo',this).removeClass("fa-user-slash");
            $('> .crnSeatInfo > .fas',this).addClass("fa-user-check");
          }

          $('> .crnSeatInfo > .seatsRemaining',this).attr('href',"http://www.uvm.edu/academics/courses/?term=202001&crn="+newCrn);
          $('> .crnSeatInfo > .seatsRemaining',this).html(crnData.totalRemaining+" seats left")

        }
        else{
          console.log("No crndata for "+newCrn);
          $('> .crnInfo',this).html("Invalid CRN");
          $('> .crnInfo',this).addClass('warning');
          $('> .crnSeatInfo',this).hide();
        }
      }
      else{
        $('> input',this).addClass("empty");
        $('> .crnInfo',this).html("")
      }
    }


  });
}

$(document).ready(function(){
  $('body').on('click', 'a', function(){
   chrome.tabs.create({url: $(this).attr('href')});
   return false;
  });
});

// When save is clicked on popup.html, collectData is called.
window.addEventListener('load', function load(event){
    fillData();
    setTimeout(function(){
      updateAllCrnInfo(false);
    }, 500);

    document.getElementById('dataForm').addEventListener('change', function() {
        collectData();
        updateAllCrnInfo(true);
    });

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
  var crn_1a = document.getElementById('crn_1a');
  var crn_2a = document.getElementById('crn_2a');
  var crn_3a = document.getElementById('crn_3a');
  var crn_4a = document.getElementById('crn_4a');
  var crn_5a = document.getElementById('crn_5a');
  var crn_6a = document.getElementById('crn_6a');
  var crn_7a = document.getElementById('crn_7a');
  var crn_8a = document.getElementById('crn_8a');
  var crn_1b = document.getElementById('crn_1b');
  var crn_2b = document.getElementById('crn_2b');
  var crn_3b = document.getElementById('crn_3b');
  var crn_4b = document.getElementById('crn_4b');
  var crn_5b = document.getElementById('crn_5b');
  var crn_6b = document.getElementById('crn_6b');
  var crn_7b = document.getElementById('crn_7b');
  var crn_8b = document.getElementById('crn_8b');

  chrome.storage.local.get(['username'], function(result) { username.value = result.username; });
  chrome.storage.local.get(['password'], function(result) { password.value = result.password; });
  chrome.storage.local.get(['date'], function(result) { date.value = result.date; });
  chrome.storage.local.get(['time'], function(result) { time.value = result.time; });
  chrome.storage.local.get(['crn_1a'], function(result) { crn_1a.value = result.crn_1a; });
  chrome.storage.local.get(['crn_2a'], function(result) { crn_2a.value = result.crn_2a; });
  chrome.storage.local.get(['crn_3a'], function(result) { crn_3a.value = result.crn_3a; });
  chrome.storage.local.get(['crn_4a'], function(result) { crn_4a.value = result.crn_4a; });
  chrome.storage.local.get(['crn_5a'], function(result) { crn_5a.value = result.crn_5a; });
  chrome.storage.local.get(['crn_6a'], function(result) { crn_6a.value = result.crn_6a; });
  chrome.storage.local.get(['crn_7a'], function(result) { crn_7a.value = result.crn_7a; });
  chrome.storage.local.get(['crn_8a'], function(result) { crn_8a.value = result.crn_8a; });
  chrome.storage.local.get(['crn_1b'], function(result) { crn_1b.value = result.crn_1b; });
  chrome.storage.local.get(['crn_2b'], function(result) { crn_2b.value = result.crn_2b; });
  chrome.storage.local.get(['crn_3b'], function(result) { crn_3b.value = result.crn_3b; });
  chrome.storage.local.get(['crn_4b'], function(result) { crn_4b.value = result.crn_4b; });
  chrome.storage.local.get(['crn_5b'], function(result) { crn_5b.value = result.crn_5b; });
  chrome.storage.local.get(['crn_6b'], function(result) { crn_6b.value = result.crn_6b; });
  chrome.storage.local.get(['crn_7b'], function(result) { crn_7b.value = result.crn_7b; });
  chrome.storage.local.get(['crn_8b'], function(result) { crn_8b.value = result.crn_8b; });

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
     var crn_1a = document.getElementById('crn_1a').value;
     var crn_2a = document.getElementById('crn_2a').value;
     var crn_3a = document.getElementById('crn_3a').value;
     var crn_4a = document.getElementById('crn_4a').value;
     var crn_5a = document.getElementById('crn_5a').value;
     var crn_6a = document.getElementById('crn_6a').value;
     var crn_7a = document.getElementById('crn_7a').value;
     var crn_8a = document.getElementById('crn_8a').value;
     var crn_1b = document.getElementById('crn_1b').value;
     var crn_2b = document.getElementById('crn_2b').value;
     var crn_3b = document.getElementById('crn_3b').value;
     var crn_4b = document.getElementById('crn_4b').value;
     var crn_5b = document.getElementById('crn_5b').value;
     var crn_6b = document.getElementById('crn_6b').value;
     var crn_7b = document.getElementById('crn_7b').value;
     var crn_8b = document.getElementById('crn_8b').value;

     var crnData = [username, password, date, time, crn_1a, crn_2a, crn_3a, crn_4a, crn_5a, crn_6a, crn_7a, crn_8a, crn_1b, crn_2b, crn_3b, crn_4b, crn_5b, crn_6b, crn_7b, crn_8b];
     console.log(crnData); // Show the data for bug fixing

     chrome.storage.local.set({'username': username});
     chrome.storage.local.set({'password': password});
     chrome.storage.local.set({'date': date});
     chrome.storage.local.set({'time': time});
     chrome.storage.local.set({'crn_1a': crn_1a});
     chrome.storage.local.set({'crn_2a': crn_2a});
     chrome.storage.local.set({'crn_3a': crn_3a});
     chrome.storage.local.set({'crn_4a': crn_4a});
     chrome.storage.local.set({'crn_5a': crn_5a});
     chrome.storage.local.set({'crn_6a': crn_6a});
     chrome.storage.local.set({'crn_7a': crn_7a});
     chrome.storage.local.set({'crn_8a': crn_8a});
     chrome.storage.local.set({'crn_1b': crn_1b});
     chrome.storage.local.set({'crn_2b': crn_2b});
     chrome.storage.local.set({'crn_3b': crn_3b});
     chrome.storage.local.set({'crn_4b': crn_4b});
     chrome.storage.local.set({'crn_5b': crn_5b});
     chrome.storage.local.set({'crn_6b': crn_6b});
     chrome.storage.local.set({'crn_7b': crn_7b});
     chrome.storage.local.set({'crn_8b': crn_8b});
}
