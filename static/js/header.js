$( document ).ready(function() {
  var path = window.location.pathname;

  if (path === '/console/home' || path === '/features') {
  	$('#navbar1').addClass('active');
  } else if (path === '/author/profile' || path === '/movies') {
  	$('#navbar2').addClass('active');
  } else if (path === '/events') {
  	$('#navbar3').addClass('active');
  } else if (path.indexOf('draft') !== -1 || path === '/about') {
  	$('#navbar4').addClass('active');
  }
});