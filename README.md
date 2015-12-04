The Moviegoer Web App
---------------------

### Breakdown 

- NodeJS/Express server
- Amazon RDS Tables
	- articles [columns: articleId, isPublished (0 = saved, 1 = submitted, 2 = published), publicationDate, updateDate, type, title, cleanTitle, url, authorUsername, image]
	- events [columns: eventId, date, location, image, presenter, authorUsername, refreshments, goingCount, fbLink]
	- authors [columns: username, email, name, password, isEditor, image, bio]
	- users [columns: userId, email]
- [DynamoDB](https://www.youtube.com/watch?v=tDqLwzQEOmM "Video Tutorial") Tables
	- articles [key: articleId, value: { imgList: [imageUrl], captionList: [captions] text, history: [{authorUsername, date, text}] }]
	- events [key: eventId, value: { rsvpList: [{authorUsername}] }]
	- authors [key: username, value: { articleList: [{articleId}] }]
- S3 storage
	- images
- React Frontend 

### Features apart from existing website

- Authors
	- Create account
	- Log in / Log out
	- Edit profile (including image, bio, email, and password)
	- Write and edit articles (adding text and images)
	- Get notified about editor requests
- Editor
	- Approve author account creation
	- Same features as authors 
	- Approve and publish articles submitted by authors
	- Make changes in articles 
	- Send notifications to authors 
	- Add events
	- View and change editor privileges
- User
	- Sign up for emails