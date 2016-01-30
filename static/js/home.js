$(document).ready(function () {
  $('input:checked').closest('label').css('font-weight', 'bold');

  $('.assignedEditor input').change(function () {
    var _this = $(this);
    _this.closest('.assignedEditor').find('label').css('font-weight', 'normal');
    _this.closest('label').css('font-weight', 'bold');
    $.post('/writer/' + _this.prop('name') + '/editor', {editor: $(this).val()});
  });

  $('.deleteArticle').click(function (e) {
    var del = window.confirm('Are you sure you want to delete this article?');
    if (!del) {
      e.preventDefault();
    }
  });

});