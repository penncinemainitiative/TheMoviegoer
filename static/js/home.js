$(document).ready(function () {
  $('input:checked').closest('label').css('font-weight', 'bold');

  $('.assignedEditor input').change(function () {
    var _this = $(this);
    _this.closest('.assignedEditor').find('label').css('font-weight', 'normal');
    _this.closest('label').css('font-weight', 'bold');
    $.post('/writer/' + _this.prop('name') + '/editor', {editor: $(this).val()});
  });

  $('.notify').click(function () {
    var _this = $(this);
    var articleId = _this.closest('tr').data('articleid');
    var postData = {
      articleId: articleId,
      username: _this.data('username')
    };
    _this.text('Notifying...');
    $.post('/article/' + articleId + '/notify', postData, function (data) {
      if (data.success) {
        _this.replaceWith('Notified!');
      } else {
        _this.replaceWith('Error');
      }
    });
  });


  $('.emailAuthor').click(function () {
    var _this = $(this);
    var articleId = _this.closest('tr').data('articleid');
    var email = _this.data('email');
    var emailTo = "mailto:" + email + "?subject=An article needs your attention on Penn Moviegoer&body=";
    emailTo += "http://pennmoviegoer.com/article/" + articleId + "/draft";
    window.location = emailTo;
  });

  $('.deleteArticle').click(function (e) {
    var del = window.confirm('Are you sure you want to delete this article?');
    if (!del) {
      e.preventDefault();
    }
  });

});