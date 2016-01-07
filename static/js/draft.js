$(document).ready(function () {

  var path = window.location.pathname;
  var pathArr = path.split('/');
  var articleId = parseInt(pathArr[2]);

  // Check correct type radio on load
  var typeRadioVal = $('#typeRadioVal').html();
  if (typeRadioVal === 'oldmovie') {
    $('#oldmovieRadio').prop('checked', true);
  } else if (typeRadioVal === 'newmovie') {
    $('#newmovieRadio').prop('checked', true);
  }

  // Edit Button
  $('button#editBtn').click(function () {
    $('#issue').hide();
    $('#previewView').hide();
    $('#editView').show();
    $('#prevBtn').show();
    $('#editBtn').hide();
    $('#saveBtn').show();
  });

  var showSave = function () {
    $('#saveAlert').show();
    setTimeout(function () {
      $('#saveAlert').fadeOut();
    }, 3000);
  };

  var retract = function() {
    $('#issue').hide();

    $.post('/article/' + articleId + '/retract', function (data) {
      if (data.success) {
        window.location = '/';
      }
    });
  };

  var coverPhoto = function(e) {
    var currentbtn = $(e.target).closest('button');
    if (currentbtn.hasClass('btn-primary')) {
      return;
    }

    var postData = {
      image: currentbtn.val()
    };

    $.post('/article/' + articleId + '/cover', postData, function (data) {
      if (data.success) {
        $('.starBtn').removeClass('btn-primary');
        currentbtn.addClass('btn-primary');
      }
    });
  };

  var save = function(e, callback) {
    $('#issue').hide();
    var text = $('#textInput').val();
    var heading = $('#headInput').val();
    var excerpt = $('#excerptInput').val();
    var typeVal = $('input[name=typeInput]:checked').val();

    if (text === '' || heading === '') {
      $('#issue').show().empty().append('Please enter text and a title for the article before you <b>save</b>!');
      return;
    }

    var postData = {
      title: heading,
      type: typeVal,
      text: text,
      excerpt: excerpt
    };

    $.post('/article/' + articleId, postData, function (data) {
      if (data.success) {
        showSave();
        if (callback) {
          callback();
        }
      }
    });
  };

  var publish = function(e) {
    var text = $('#textInput').val();
    var heading = $('#headInput').val();
    var excerpt = $('#excerptInput').val();
    var typeVal = $('input[name=typeInput]:checked').val();
    var postData = {
      title: heading,
      type: typeVal,
      text: text,
      excerpt: excerpt
    };
    save(e, function() {
      $.post('/article/' + articleId + '/publish', postData, function (data) {
        if (data.success) {
          window.location = '/';
        }
      });
    });
  };

  var submit = function(e) {
    var text = $('#textInput').val();
    var heading = $('#headInput').val();
    var excerpt = $('#excerptInput').val();
    var typeVal = $('input[name=typeInput]:checked').val();
    var postData = {
      title: heading,
      type: typeVal,
      text: text,
      excerpt: excerpt
    };
    save(e, function() {
      $.post('/article/' + articleId + '/submit', postData, function (data) {
        if (data.success) {
          window.location = '/console/home';
        }
      });
    });
  };

  var preview = function(e) {
    save(e, function() {
      var text = $('#textInput').val();
      var heading = $('#headInput').val();

      $('#previewView').show();
      $('#editView').hide();
      $('#prevBtn').hide();
      $('#editBtn').show();
      $('#saveBtn').hide();

      $('.posttxt').empty().html(marked(text));
      $('#headPrev').empty();
      $('#headPrev').append(heading);
    });
  };

  $('button#prevBtn').click(preview);
  $('button#submBtn').click(submit);
  $('button.starBtn').click(coverPhoto);
  $('button#retractBtn').click(retract);
  $('button#saveBtn').click(save);
  $('button#publBtn').click(publish);

});