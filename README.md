The Moviegoer Web App
---------------------

### Breakdown 

- NodeJS/Express server
- [DynamoDB](https://www.youtube.com/watch?v=tDqLwzQEOmM "Video Tutorial") Tables
	- articles [key: date (yyyymmdd-hhmm), value: {date, type, title, cleantitle, urlTitle, authorUsername, image, displayImage, text, imgList, submissionDate}]
	- features [key: date (yyyymmdd-hhmm), value: {}]
	- movies
	- newmovies
	- oldmovies
	- weekly
	- hard8
	- atb
	- podcast
	- archive [key: articleId, value: {submissionDate, type, title, cleantitle, urlTitle, authorUsername, image, displayImage, text, editHistory (list of previous texts), imgList}]
	- events [key: date (yyyymmdd-hhmm), value: {date, location, image, presenter, dinner, rsvpList, goingCount, fblink}]
	- authors [key: username, value: {name, email, hasAccount, password, isEditor, image, bio, articleList}]
- S3 storage
	- images
- React Frontend 

### Features apart from existing website

- Authors
	- Create account
	- Log in / Log out
	- Edit profile
	- Write and edit articles (adding text and images)
	- Get notified about editor requests
- Editor
	- Approve author account creation
	- Same features as authors 
	- Approve and publish articles submitted by authors
	- Make changes in articles 
	- Send notifications to authors 
	- Add events