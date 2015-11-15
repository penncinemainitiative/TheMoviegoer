The Moviegoer Web App
---------------------

- NodeJS/Express server
- DynamoDB Tables
	- articles [key: date (yyyymmdd-hhmm), value: {date, type, title, cleantitle, urlTitle, authorUsername, image, displayImage, text, imgList, submissionDate}]
	- features [key: date (yyyymmdd-hhmm), value: {}]
	- movies
	- newmovies
	- oldmovies
	- weekly
	- hard8
	- atb
	- podcast
	- archive [key: ???, value: {submissionDate, type, title, cleantitle, urlTitle, authorUsername, image, displayImage, text, editHistory (list of previous texts), imgList}]
	- events [key: date (yyyymmdd-hhmm), value: {date, location, image, presenter, dinner, rsvpList, goingCount, fblink}]
	- authors [key: username, value: {name, email, hasAccount, password, isEditor, image, bio, articleList}]
- S3 storage
	- images