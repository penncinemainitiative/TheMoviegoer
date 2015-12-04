$( document ).ready(function() {

	// Modal Things
	$('#photoForm').hide();
	$('#profileImg').click(function () {
    $('#fileInput').trigger('click');
  });
  $('#fileInput').change(function () {
    $('#photoForm').submit(); 
  });

	// Preview Button
	$('button#prevBtn').click(function () {
		$('#issue').hide();
		var text = $('#textInput').val();
		var heading = $('#headInput').val();
		var typeVal = $('input[name=typeInput]:checked').val();
		var type;

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

		if (typeVal === 'feature') {
			type = "Feature";
		} else if (typeVal === 'oldmovie') {
			type = "Old Movie Review";
		} else if (typeVal === 'newmovie') {
			type = "New Movie Review";
		}
		$('#window').empty();
		$('#window').append(text);
		$('#headPrev').empty();
		$('#headPrev').append(heading);
		$('#typePrev').empty();
		$('#typePrev').append(type);
	});

	// Edit Button
	$('button#editBtn').click(function () {
		$('#issue').hide();
		$('#previewView').hide();
		$('#editView').show();
		$('#prevBtn').show();
		$('#editBtn').hide();
	});

	//Images
	var img = [];

});