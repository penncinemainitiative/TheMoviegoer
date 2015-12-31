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

    $.post('/console/login', loginData, function (data) {
      if (!data.success) {
        $('#issue').show();
        $('#issue').empty();
        $('#issue').append(data.msg);
      } else {
        window.location = '/console/home';
      }
    });
  });

  $('button#signupBtn').click(function () {
    var username = $('#inputUser').val();
    var name = $('#inputName').val();
    var email = $('#inputEmail').val();
    var pw = $('#inputPassword').val();
    var pwConfirm = $('#inputPasswordConfirm').val();

    if (username === '' || email === '' || pw === '' || pwConfirm === '' || name === '') {
      $('#issue').show();
      $('#issue').empty();
      $('#issue').append('Please fill out all fields!');
      return;
    }

    if (pw !== pwConfirm) {
      $('#issue').show();
      $('#issue').empty();
      $('#issue').append('Passwords do not match!');
      return;
    }

    var signupData = {
      username: username,
      name: name,
      password: pw,
      email: email
    };

    $.post('/author/create', signupData, function (data) {
      $('#issue').show();
      $('#issue').empty();
      if (data.success) {
        $('#issue').removeClass("alert-danger");
        $('#issue').addClass("alert-success");
      } else {
        $('#issue').removeClass("alert-success");
        $('#issue').addClass("alert-danger");
      }
      $('#issue').append(data.msg);
    });
  });

});