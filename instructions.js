$(document).ready(function(){
  $('body').on('click', 'a.openExternal', function(){
   chrome.tabs.create({url: $(this).attr('href')});
   return false;
  });
});
