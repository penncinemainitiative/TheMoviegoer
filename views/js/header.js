$( document ).ready(function() {
  var path = window.location.pathname;

  if (path === '/console/home' || path === '/') {
  	$('#navbar1').addClass('active');
  } else if (path === '/account/profile' || path === '/features') {
  	$('#navbar2').addClass('active');
  } else if (path === '/events') {
  	$('#navbar3').addClass('active');
  } else if (path.indexOf('draft') !== -1 || path === '/about') {
  	$('#navbar4').addClass('active');
  }
});