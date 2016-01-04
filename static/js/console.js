$( document ).ready(function() {

  var login = function () {
    var un = $('#inputEmail').val();
    var pw = $('#inputPassword').val();

    if (un === '' || pw === '') {
      return $('#issue').show().empty().append('Missing data!');
    }

    var loginData = {
      username: un,
      password: pw
    };

    $.post('/console/login', loginData, function (data) {
      if (!data.success) {
        $('#issue').show().empty().append(data.msg);
      } else {
        window.location = '/console/home';
      }
    });
  };

  var signup = function () {
    var username = $('#inputUser').val();
    var name = $('#inputName').val();
    var email = $('#inputEmail').val();
    var pw = $('#inputPassword').val();
    var pwConfirm = $('#inputPasswordConfirm').val();

    if (username === '' || email === '' || pw === '' || pwConfirm === '' || name === '') {
      return $('#issue').show().empty().append('Missing data!');
    }

    if (pw !== pwConfirm) {
      $('#issue').show().empty().append('Passwords do not match!');
      return;
    }

    var signupData = {
      username: username,
      name: name,
      password: pw,
      email: email
    };

    $.post('/author/create', signupData, function (data) {
      var issue = $('#issue');
      if (data.success) {
        issue.removeClass("alert-danger").addClass("alert-success");
      } else {
        issue.removeClass("alert-success").addClass("alert-danger");
      }
      issue.show().empty().append(data.msg);
    });
  };

  $('button#loginBtn').click(login);
  $('button#signupBtn').click(signup);
});