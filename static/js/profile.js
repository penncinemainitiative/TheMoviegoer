$( document ).ready(function() {

  $('#photoForm').hide();
  $('#updateProfile').hide();

  var initName;
  var initEmail;
  var initBio;

  $('#fileInput').change(function () {
    $('#photoForm').submit();
  });

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

  $('#pwcBtn').click(function () {
    $('#issueModal').hide();

    var opw = $('#oldpw').val();
    var npw1 = $('#newpw1').val();
    var npw2 = $('#newpw2').val();

    if (opw === '' || npw1 === '' || npw2 === '') {
      return;
    }

    if (npw1 !== npw2) {
      $('#issueModal').show();
      $('#issueModal').empty();
      $('#issueModal').append('New passwords do not match up!');
      return;
    }

    var postData = {
      oldpassword: opw,
      newpassword: npw1
    };

    $.post('/author/password', postData, function (data) {
      if (!data.success) {
        $('#issueModal').show();
        $('#issueModal').empty();
        $('#issueModal').append(data.msg);
        return;
      } else {
        // close modal and show success
        setTimeout(function () {
          $('#closeModalBtn').trigger('click');
          showSave();
        }, 500);
      }
    });
  });

});