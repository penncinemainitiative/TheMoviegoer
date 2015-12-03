$( document ).ready(function() {
  var path = window.location.pathname;

  if (path === '/home') {
  	$('#navHome').addClass('active');
  } else if (path === '/profile') {
  	$('#navProfile').addClass('active');
  } else if (path === '/events') {
  	$('#navEvents').addClass('active');
  } else if (path === '/new') {
  	$('#navNewArticle').addClass('active');
  }
});