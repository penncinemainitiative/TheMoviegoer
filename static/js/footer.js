$( document ).ready(function() {

  $('span#logout').click(function () {
    $.post('/console/logout', {}, function (data) {
      if (data.success) {
        window.location = '/console';
      }
    });
  });

});