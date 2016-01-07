$( document ).ready(function() {
  var path = window.location.pathname;
  var headerItems = $('#header h5');

  if (path === '/console/home' || path.indexOf('features') !== -1) {
    $(headerItems[0]).addClass('active');
  } else if (path === '/author/profile' || path.indexOf('movies') !== -1) {
    $(headerItems[1]).addClass('active');
  } else if (path === '/events') {
    $(headerItems[2]).addClass('active');
  } else if (path.indexOf('draft') !== -1 || path === '/about') {
    console.log(path);
    $(headerItems[3]).addClass('active');
  }

  var search = $('#search');

  search.select2({
    placeholder: 'Search articles',
    escapeMarkup: function (m) {return m;},
    ajax: {
      cache: true,
      delay: 250,
      type: 'POST',
      url: '/search',
      processResults: function (data) {
        return {
          results: $.map(data, function(obj) {
            return { id: '/article/' + obj.articleId, text: obj.title };
          })
        };
      }
    }
  });

  search.on('select2:select', function(event) {
    window.location = $(event.target).val();
  })
});