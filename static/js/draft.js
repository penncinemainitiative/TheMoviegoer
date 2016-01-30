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
    }, 1000);
  };

  var retract = function () {
    $('#issue').hide();

    $.post('/article/' + articleId + '/retract', function (data) {
      if (data.success) {
        window.location = '/';
      }
    });
  };

  var coverPhoto = function (e) {
    save(e, function () {
      var currentbtn = $(e.target).closest('button');
      if (currentbtn.hasClass('btn-primary')) {
        return;
      }

      var postData = {
        image: currentbtn.val()
      };

      $.post('/article/' + articleId + '/cover', postData, function (data) {
        if (data.success) {
          location.reload();
        }
      });
    });
  };

  var save = function (e, callback) {
    $('#issue').hide();
    var text = $('textarea').val();
    var title = $('#titleInput').val();
    var excerpt = $('#excerptInput').val();
    var typeVal = $('input[name=typeInput]:checked').val();

    var postData = {
      title: title,
      type: typeVal,
      text: text.replace(/(<([^>]+)>)/ig, ""),
      excerpt: excerpt
    };

    $.post('/article/' + articleId, postData, function (data) {
      if (data.success) {
        showSave();
        if (callback) {
          callback(postData);
        }
      }
    });
  };

  var publish = function (e) {
    save(e, function (postData) {
      $.post('/article/' + articleId + '/publish', postData, function (data) {
        if (data.success) {
          window.location = '/';
        }
      });
    });
  };

  var finalReview = function (e) {
    save(e, function (postData) {
      $.post('/article/' + articleId + '/finalReview', postData, function (data) {
        if (data.success) {
          window.location = '/console/home';
        }
      });
    });
  };

  var submit = function (e) {
    save(e, function (postData) {
      $.post('/article/' + articleId + '/submit', postData, function (data) {
        if (data.success) {
          window.location = '/console/home';
        }
      });
    });
  };

  var preview = function (e) {
    save(e, function (postData) {
      var text = postData.text;
      var title = postData.title;

      $('#previewView').show();
      $('#editView').hide();
      $('#prevBtn').hide();
      $('#editBtn').show();
      $('#saveBtn').hide();

      $('.posttxt').empty().html(marked(text));
      $('.post-title').empty().append(title);
    });
  };

  var submitPhoto = function (e) {
    save(e, function () {
      $('#photoForm').submit();
    });
  };

  var submitDraft = function (e) {
    save(e, function () {
      $('#draftForm').submit();
    });
  };

  var beforeunload = function (e) {
    save(e);
  };

  $('button#prevBtn').click(preview);
  $('button#submBtn').click(submit);
  $('button#finalReviewBtn').click(finalReview);
  $('button.starBtn').click(coverPhoto);
  $('button#retractBtn').click(retract);
  $('button#saveBtn').click(save);
  $('button#publBtn').click(publish);
  $('#photoInput').change(submitPhoto);
  $('#draftInput').change(submitDraft);

  if (path.indexOf('draft') > -1) {
    window.addEventListener('beforeunload', beforeunload);
    $("textarea#textInput").pagedownBootstrap();
  }

  var authorSearch = $('#authorInput');

  authorSearch.select2({
    placeholder: 'Search authors',
    escapeMarkup: function (m) {return m;},
    ajax: {
      cache: true,
      delay: 250,
      type: 'POST',
      url: '/search/authors',
      processResults: function (data) {
        return {
          results: $.map(data, function(obj) {
            return { id: obj.username, text: obj.name };
          })
        };
      }
    }
  });

  authorSearch.on('select2:select', function() {
    $.post('/article/' + articleId + '/author', {author : authorSearch.val()});
  });

});