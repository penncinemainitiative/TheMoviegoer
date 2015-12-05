$( document ).ready(function() {

	// Check correct type radio on load
	var typeRadioVal = $('#typeRadioVal').html();
	if (typeRadioVal === 'oldmovie') {
		$('#oldmovieRadio').prop('checked', true);
	} else if (typeRadioVal === 'newmovie') {
		$('#newmovieRadio').prop('checked', true);
	}

	// Modal Things
	$('#photoForm').hide();
	$('#profileImg').click(function () {
    $('#fileInput').trigger('click');
  });
  $('#fileInput').change(function () {
  	var input = $('#fileInput');
		if (input[0].files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#profileImg').attr('src', e.target.result);
			}

			reader.readAsDataURL(input[0].files[0]);
		}
    //$('#photoForm').submit(); 
  });
  $('button#modalImgUpload').click(function () {
  	$('#issueModal').hide();
  	var input = $('#fileInput');
  	var caption = $('#captionInput');
  	if (input[0].files.length === 0 || caption.val() === '') {
  		$('#issueModal').show();
  		$('#issueModal').empty();
  		$('#issueModal').append('Please select image and enter caption to <b>Upload</b>!');
  		return;
  	}
  	// add caption to form and submit!
  	$.post('/addCaption', {caption: caption.val()}, function (data) {
  		if (data.success) {
  			$('#photoForm').submit();
  		}
  	});
  });

  var path = window.location.pathname;
  var pathArr = path.split('/');
  var articleId = parseInt(pathArr[2]);

	// Preview Button
	$('button#prevBtn').click(function () {
		$('#issue').hide();
		var text = $('#textInput').val();
		var heading = $('#headInput').val();
		var typeVal = $('input[name=typeInput]:checked').val();
		var type;
		if (typeVal === 'feature') {
			type = "Feature";
		} else if (typeVal === 'oldmovie') {
			type = "Old Movie";
		} else if (typeVal === 'newmovie') {
			type = "New Movie";
		}

		if (text === '' || heading === '') {
			$('#issue').show();
			$('#issue').empty();
			$('#issue').append('Please enter a title and text for the article before you <b>Preview</b>!');
			return;
		}

		$('#previewView').show();
		$('#editView').hide();
		$('#prevBtn').hide();
		$('#editBtn').show();
		$('#saveBtn').hide();

		$('#window').empty();
		$('#window').append(text);
		$('#headPrev').empty();
		$('#headPrev').append(heading);
		$('#typePrev').empty();
		$('#typePrev').append(type);

		var postData = {
			articleId: articleId,
			title: heading,
			type: typeVal,
			text: text
		};
		$.post('/saveArticle', postData, function (data) {
			if (data.success) {
				showSave();
			}
		});
	});

	// Edit Button
	$('button#editBtn').click(function () {
		$('#issue').hide();
		$('#previewView').hide();
		$('#editView').show();
		$('#prevBtn').show();
		$('#editBtn').hide();
		$('#saveBtn').show();
	});

	//Images
	var img = [];
	var caption = [];

	$("button#imgUploadBtn").click(function () {
		$('#issue').hide();
		var text = $('#textInput').val();
		var heading = $('#headInput').val();
		var typeVal = $('input[name=typeInput]:checked').val();

		if (text === '' || heading === '') {
			setTimeout(function () {
				$('#closeModalBtn').trigger('click');
			}, 1000);

			$('#issue').show();
			$('#issue').empty();
			$('#issue').append('Please enter a title and text for the article before you <b>Save</b>!');
			return;
		}

		var postData = {
			articleId: articleId,
			title: heading,
			type: typeVal,
			text: text
		};
		$.post('/saveArticle', postData, function (data) {
			if (data.success) {
				showSave();
			}
		});
	});

	var showSave = function () {
		$('#saveAlert').show();
		setTimeout(function () {
	    $('#saveAlert').fadeOut();
	  }, 3000);
	};

	$('button#saveBtn').click(function () {
		$('#issue').hide();
		var text = $('#textInput').val();
		var heading = $('#headInput').val();
		var typeVal = $('input[name=typeInput]:checked').val();

		if (text === '' || heading === '') {
			$('#issue').show();
			$('#issue').empty();
			$('#issue').append('Please enter a title and text for the article before you <b>Save</b>!');
			return;
		}

		var postData = {
			articleId: articleId,
			title: heading,
			type: typeVal,
			text: text
		};
		$.post('/saveArticle', postData, function (data) {
			if (data.success) {
				showSave();
			}
		});
	});

	$('button.starBtn').click(function (e) {
		
		var currentbtn = $(e.target).closest('button');
		if (currentbtn.hasClass('btn-primary')) {
			return;
		}

		var coverString = currentbtn.val().split(';');
		var cover = parseInt(coverString[0]);
		var image = coverString[1];
		var postData = {
			articleId: articleId,
			image: image,
			imageIndex: cover
		};
		$.post('/saveCover', postData, function (data) {
			if (data.success) {
				$('.starBtn').removeClass('btn-primary');
				currentbtn.addClass('btn-primary');
			}
		});
	});

});