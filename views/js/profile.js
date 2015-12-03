$( document ).ready(function() {

  $('#inputName').hide();
  $('#inputBio').hide();
  $('#saveBtn').hide();
  $('#photoForm').hide();

  var initName;
  var initBio;

  $('#fileInput').change(function () { 
    // select the form and submit
    console.log('lol');
    $('#photoForm').submit(); 
  });

  $('button#editBtn').click(function () {
    $('#editBtn').hide();
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

});