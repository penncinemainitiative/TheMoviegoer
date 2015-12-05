$( document ).ready(function() {

  $('#photoForm').hide();

  var initName;
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
    $('#inputBio').show();
    $('#saveBtn').show();
    initName = $('#inputName').val();
    initBio = $('#inputBio').val();
  });

  $('button#saveBtn').click(function () {
    var name = $('#inputName').val();
    var bio = $('#inputBio').val();

    if (name === '' || bio === '') {
      $('#issue').show();
      $('#issue').empty();
      $('#issue').append('You really should have a name and bio!');
      return;
    }

    if (name !== initName || bio !== initBio) {
      $('#profileName').empty();
      $('#profileName').append(name);
      $('#profileBio').empty();
      $('#profileBio').append(bio);

      var editData = {
        name: name,
        bio: bio
      };
      $.post('/editProfile', editData, function (data) {
        if (!data.success) {
          return;
        }
      });
    }

    $('#editBtn').show();
    $('#pwBtn').show();
    $('#profileName').show();
    $('#profileBio').show();
    $('#issue').hide();
    $('#inputName').hide();
    $('#inputBio').hide();
    $('#saveBtn').hide();
  });

  $('#profileImg').click(function () {
    $('#fileInput').trigger('click');
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

    $.post('/changePassword', postData, function (data) {
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