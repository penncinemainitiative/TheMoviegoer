$(document).ready(function () {

  var message = function (msg) {
    $('.alert').show().text(msg);
  };

  $('#eventForm').submit(function (e) {
    var photo = $('input[name=photo]').val();
    var newEvent = $('.modal-title').text() === 'New event';
    if (!photo && newEvent) {
      e.preventDefault();
      message('At least upload a photo!');
    }
  });

  $('#createEvent').click(function() {
    $('#eventForm :input').not(':submit').val('');
    $('.modal-title').text('New event');
    $('#eventForm').prop('action', '/events/create');
  });

  $('.editEvent').click(function (e) {
    var articleId = $(e.target).closest('button').data('articleid');
    $('.modal-title').text('Edit event');
    $('#eventForm').prop('action', '/events/' + articleId);
    $.get('/events/' + articleId, function (data) {
      $.each(data, function (name, val) {
        var $el = $('[name="'+name+'"]');
        if (name === 'date') {
          val = val.split('T')[0];
        }
        $el.val(val);
      })
    });
  });

  $('.deleteEvent').click(function (e) {
    var articleId = $(e.target).closest('button').data('articleid');
    $.get('/events/delete/' + articleId, function () {
      window.location = '/events';
    });
  });

});