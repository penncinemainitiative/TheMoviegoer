$( document ).ready(function() {

  $('span#logout').click(function () {
    $.post('/logout', {}, function (data) {
      if (data.success) {
        window.location = '/console';
      }
    });
  });

});