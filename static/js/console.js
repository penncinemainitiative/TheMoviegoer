$( document ).ready(function() {

  var message = function(msg) {
    $('.alert').show().text(msg);
  };

  var login = function (e) {
    e.preventDefault();
    var username = $('input[name=username]').val();
    var password = $('input[name=password]').val();

    if (username === '') {
      return message('Empty username!');
    }

    if (password === '') {
      return message('Empty password!');
    }

    var loginData = {
      username: username,
      password: password
    };

    $.post('/console/login', loginData, function (data) {
      if (!data.success) {
        message(data.msg);
      } else {
        window.location = '/console/home';
      }
    });
  };

  var signup = function (e) {
    e.preventDefault();
    var username = $('input[name=username]').val();
    var name = $('input[name=name]').val();
    var email = $('input[name=email]').val();
    var pw = $('input[name=password]').val();
    var pwConfirm = $('input[name=passwordConfirm]').val();

    if (username === '' || email === '' || pw === '' || pwConfirm === '' || name === '') {
      return message('Fill out all the fields!');
    }

    if (pw !== pwConfirm) {
      return message("Passwords don't match!");
    }

    var signupData = {
      username: username,
      name: name,
      password: pw,
      email: email
    };

    $.post('/author/create', signupData, function (data) {
      var issue = $('.alert');
      if (data.success) {
        issue.removeClass("alert-danger").addClass("alert-success");
      } else {
        issue.removeClass("alert-success").addClass("alert-danger");
      }
      message(data.msg);
    });
  };

  $('#loginForm').submit(login);
  $('#signupForm').submit(signup);
});