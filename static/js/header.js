$( document ).ready(function() {
  var path = window.location.pathname;
  var headerItems = $('#header h5');

  if (path === '/console/home' || path.indexOf('features') !== -1) {
    $(headerItems[0]).addClass('active');
  } else if (path === '/writer/profile' || path.indexOf('movies') !== -1) {
    $(headerItems[1]).addClass('active');
  } else if (path === '/events') {
    $(headerItems[2]).addClass('active');
  } else if (path.indexOf('draft') !== -1 || path === '/about') {
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
            if ('title' in obj) {
              return { id: obj.url, text: obj.title };
            } else {
              var url = '/writer/' + obj.name.replace(/\s+/g, '');
              return { id: url, text: '<b>Author</b>: ' + obj.name };
            }
          })
        };
      }
    }
  });

  search.on('select2:select', function(event) {
    window.location = $(event.target).val();
  });
});