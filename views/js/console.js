$( document ).ready(function() {

  $('button#loginBtn').click(function () {
    var un = $('#inputEmail').val();
    var pw = $('#inputPassword').val();

    if (un === '' || pw === '') {
      $('#issue').show();
      $('#issue').empty();
      $('#issue').append('Please enter username and password!');
      return;
    }

    var loginData = {
      username: un,
      password: pw
    };

    $.post('/login', loginData, function (data) {
      if (!data.success) {
        $('#issue').show();
        $('#issue').empty();
        $('#issue').append(data.msg);
      } else {
        window.location = '/home';
      }
    });
  });

});