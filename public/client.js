// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');
  
  /*  
  test urls:
  
  https://cdn.glitch.com/8e3d9778-6068-4aac-9671-4d757320e412%2Fsnapshot_b.png?1499032467192
  
  https://cdn.glitch.com/8e3d9778-6068-4aac-9671-4d757320e412%2FSanta_Rita_Water_Reclamation_Facility_-_YouTube2.png?1499032477373
  
  https://cdn.glitch.com/8e3d9778-6068-4aac-9671-4d757320e412%2FIMG_8608.JPG?1499032611865
  
  */
  
  $.get('/dreams', function(dreams) {
    dreams.forEach(function(dream) {
      $('<li></li>').text(dream).appendTo('ul#dreams');
    });
  });



});
