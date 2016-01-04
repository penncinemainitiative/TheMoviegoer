$( document ).ready(function() {

  $('#photoForm').hide();
  $('#updateProfile').hide();

  var initName;
  var initEmail;
  var initBio;

  $('button#editBtn').click(function () {
    $('#editBtn').hide();
    $('#pwBtn').hide();
    $('#profileName').hide();
    $('#profileBio').hide();
    $('#inputName').show();
    $('#inputEmail').show();
    $('#inputBio').show();
    $('#updateProfile').show();
    initName = $('#inputName').val();
    initEmail = $('#inputEmail').val();
    initBio = $('#inputBio').val();
  });

  $('button#updateProfile').click(function () {
    var name = $('#inputName').val();
    var email = $('#inputEmail').val();
    var bio = $('#inputBio').val();

    if (name === '' || bio === '' || email === '') {
      $('#issue').show();
      $('#issue').empty();
      $('#issue').append('Please fill out all the fields!');
      return;
    }

    if (name !== initName || bio !== initBio || email !== initEmail) {
      $('#profileName').empty();
      $('#profileName').append(name);
      $('#profileBio').empty();
      $('#profileBio').append(bio);

      var editData = {
        name: name,
        bio: bio,
        email: email
      };
      $.post('/author/profile/description', editData);
    }

    $('#editBtn').show();
    $('#pwBtn').show();
    $('#profileName').show();
    $('#profileBio').show();
    $('#issue').hide();
    $('#inputName').hide();
    $('#inputEmail').hide();
    $('#inputBio').hide();
    $('#updateProfile').hide();
  });

  var showSave = function () {
    $('#saveAlert').show();
    setTimeout(function () {
      $('#saveAlert').fadeOut();
    }, 3000);
  };

  var changePassword = function () {
    var issueModal = $('#issueModal');
    issueModal.hide();

    var oldPassword = $('#oldpw').val();
    var newPassword = $('#newpw1').val();
    var confirmPassword = $('#newpw2').val();

    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      return;
    }

    if (newPassword !== confirmPassword) {
      issueModal.show().empty().append('New passwords do not match up!');
      return;
    }

    var postData = {
      oldpassword: oldPassword,
      newpassword: newPassword
    };

    $.post('/author/password', postData, function (data) {
      if (!data.success) {
        return issueModal.show().empty().append(data.msg);
      } else {
        // close modal and show success
        setTimeout(function () {
          $('#closeModalBtn').trigger('click');
          showSave();
        }, 500);
      }
    });
  };

  var submitPhoto = function () {
    $('#photoForm').submit();
  };

  $('#pwcBtn').click(changePassword);
  $('#fileInput').change(submitPhoto);

});