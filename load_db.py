from os import listdir
import MySQLdb, json, os, codecs

with open('json/mysqldb.json') as data_file:
    data = json.load(data_file)

db = MySQLdb.connect(host=data['host'],
                     user=data['user'],
                     port=int(data['port']),
                     passwd=data['password'],
                     db=data['database'],
                     charset='utf8')
cur = db.cursor()


def execute(query):
    cur.execute(query)
    return cur.fetchall()


def reset_databases():
    try:
        execute("DROP TABLE authors")
    except:
        pass

    try:
        execute("DROP TABLE articles")
    except:
        pass

    try:
        execute("DROP TABLE images")
    except:
        pass

    try:
        execute("DROP TABLE events")
    except:
        pass

    try:
        execute("DROP TABLE drafts")
    except:
        pass

    execute(
            """CREATE TABLE `authors` (`username` varchar(255) NOT NULL,
                                      `email` VARCHAR(255) NOT NULL,
                                      `name` varchar(255) NOT NULL,
                                      `password` varchar(255) NOT NULL,
                                      `isEditor` int(11) NOT NULL,
                                      `assignedEditor` VARCHAR(255) NOT NULL,
                                      `image` VARCHAR(255) NOT NULL,
                                      `bio` text NOT NULL,
                                      PRIMARY KEY (`username`))""")
    execute(
            """CREATE TABLE `events` (`eventId` int(11) NOT NULL AUTO_INCREMENT,
                                      `date` date NOT NULL,
                                      `description` text,
                                      `location` VARCHAR(255),
                                      `image` VARCHAR(255),
                                      `film` VARCHAR(255),
                                      `fbLink` VARCHAR (255) NOT NULL,
                                      `time` time NOT NULL,
                                      `title` VARCHAR (255) NOT NULL,
                                      PRIMARY KEY (`eventId`))""")
    execute(
            """CREATE TABLE `articles` (`articleId` int(11) NOT NULL AUTO_INCREMENT,
                                      `isPublished` int(11) NOT NULL,
                                      `pubDate` date DEFAULT NULL,
                                      `updateDate` date NOT NULL,
                                      `type` VARCHAR(255) NOT NULL,
                                      `title` VARCHAR(255) NOT NULL COLLATE UTF8_GENERAL_CI,
                                      `author` VARCHAR(255) NOT NULL,
                                      `image` VARCHAR(255),
                                      `assignedEditor` VARCHAR(255) NOT NULL,
                                      `excerpt` text NOT NULL,
                                      `text` text NOT NULL,
                                      `url` VARCHAR(255) NOT NULL,
                                      PRIMARY KEY (`articleId`))""")
    execute(
            """CREATE TABLE `images` (`image` VARCHAR(255) NOT NULL,
                                      `articleId` int(11) DEFAULT NULL)""")

    execute(
            """CREATE TABLE `drafts` (`draftId` int(11) NOT NULL AUTO_INCREMENT,
                                      `date` datetime NOT NULL,
                                      `uploader` VARCHAR(255) NOT NULL,
                                      `url` VARCHAR(255) NOT NULL,
                                      `articleId` int(11) DEFAULT NULL,
                                      PRIMARY KEY (`draftId`))""")


OLD_POSTS = 'old_posts/'
OLD_AUTHORS = 'old_authors/'
OLD_EVENTS = 'old_events/'

usernames = {
    "Brad Pettigrew": "bpettigrew",
    "Nikhil Venkatesa": "nvenkatesa",
    "Alexander Atienza": "aatienza",
    "James Sheplock": "jsheplock",
    "Rahel Tekeste": "rtekeste",
    "Vaishak Kumar": "vkumar",
    "Ben Finkel": "bfinkel",
    "David Lakata": "dlakata",
    "Ritwik Bhatia": "rbhatia",
    "PCI": "pci",
    "Lucas De Barros Silva": "lsilva",
    "Eric Eisner": "eeisner",
    "Adelaide Powell": "apowell"
}


class Post(object):
    def __init__(self, title, author, date, excerpt, image, type, text, images,
                 url):
        self.isPublished = 2
        self.pubDate = date
        self.updateDate = date
        self.type = type
        self.title = title
        self.author = usernames[author]
        self.image = image
        self.excerpt = excerpt
        self.text = text
        self.images = images
        self.url = url


class Author(object):
    def __init__(self, username, name, image, bio):
        self.username = username
        self.email = ""
        self.name = name
        self.password = "$2a$10$r3B91yhkolKXlZ28/ELAEObLb10LudXbv/P8Rka8LIomxwDdCa8Q."
        self.image = image
        self.bio = bio


class Event(object):
    def __init__(self, date, description, location, image, fbLink, time, title,
                 film):
        self.date = date
        self.description = description
        self.location = location
        self.image = image
        self.fbLink = fbLink
        self.time = time
        self.title = title
        self.film = film


def get_tags(lines):
    tags = []
    for line in lines:
        if line.startswith('--') or line == '':
            break
        tag = line.split('- ')[1].strip()
        tags.append(tag)
    if 'classicmovie' in tags:
        return 'oldmovie'
    elif 'newmovie' in tags:
        return 'newmovie'
    elif 'feature' in tags:
        return 'feature'


def get_images(lines):
    pics = []
    for line in lines:
        if line.startswith('![pic'):
            pic = line.split('](')[1].strip()[:-1]
            pics.append(pic)
    return pics


def get_attr(lines, attr):
    if attr == 'text':
        for i, line in enumerate(lines):
            if line.startswith('--'):
                return ''.join(lines[i + 1:])
    elif attr == 'tags':
        for i, line in enumerate(lines):
            if line.startswith(attr):
                return get_tags(lines[i + 1:])
    elif attr == 'images':
        return get_images(lines)
    else:
        for line in lines:
            if line.startswith(attr):
                return line.split(attr + ':')[1].strip()


def get_authors():
    authors = []
    for dirname, dirnames, filenames in os.walk(OLD_AUTHORS):
        for filename in filenames:
            with codecs.open(os.path.join(dirname, filename), 'r',
                             encoding='UTF-8') as f:
                lines = f.readlines()[1:]
                name = get_attr(lines, 'author').replace('"', "")
                username = usernames[name]
                image = get_attr(lines, 'authorimage').replace('"', "")
                bio = get_attr(lines, 'bio').replace('"', "")
                author = Author(username, name, image, bio)
                authors.append(author)
    default_image = "https://s3.amazonaws.com/moviegoer/uploads/inchoate/writer/M.jpg"
    authors.append(Author("pci", "PCI", default_image, ""))
    authors.append(Author("jsheplock", "James Sheplock", default_image, ""))
    authors.append(Author("bfinkel", "Benjamin Finkel", default_image, ""))
    authors.append(Author("vkumar", "Vaishak Kumar", default_image, ""))
    authors.append(Author("admin", "Admin", default_image, ""))
    return authors


def get_posts():
    posts = []
    for filename in listdir(OLD_POSTS):
        with codecs.open(OLD_POSTS + filename, 'r', encoding='UTF-8') as f:
            lines = f.readlines()[1:]
            title = get_attr(lines, 'title').replace('"', "")
            author = get_attr(lines, 'author').replace('"', "")
            date = get_attr(lines, 'date').replace('"', "")
            image = get_attr(lines, 'image').replace('"', "")
            text = get_attr(lines, 'text').replace('"', "")
            excerpt = get_attr(lines, 'excerpt').replace('"', "")
            type = get_attr(lines, 'tags')
            images = get_attr(lines, 'images')
            images.append(image)
            url = "/" + filename.replace("markdown", "html").replace("-", "/")
            post = Post(title, author, date, excerpt, image, type, text, images,
                        url)
            posts.append(post)
    return posts


def get_events():
    events = []
    for filename in listdir(OLD_EVENTS):
        with codecs.open(OLD_EVENTS + filename, 'r', encoding='UTF-8') as f:
            lines = f.readlines()[1:]
            title = get_attr(lines, 'title').replace('"', "")
            time = "21:00:00"
            date = get_attr(lines, 'date').replace('"', "")
            image = get_attr(lines, 'image').replace('"', "")
            location = get_attr(lines, 'location').replace('"', "")
            description = get_attr(lines, 'excerpt').replace('"', "")
            film = get_attr(lines, 'film').replace('"', "")
            fbLink = "/events"
            event = Event(date, description, location, image, fbLink, time,
                          title, film)
            events.append(event)
    return events


posts = get_posts()


def setup_authors():
    authors = get_authors()
    for author in authors:
        query = "INSERT INTO authors (username, email, name, password, isEditor, image, bio, assignedEditor) " \
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        cur.execute(query, (
            author.username, "", author.name, author.password, 0, author.image,
            author.bio, "bpettigrew"))
    cur.execute("UPDATE authors SET isEditor=2 WHERE username='bpettigrew'")
    cur.execute("UPDATE authors SET isEditor=2 WHERE username='admin'")
    db.commit()


def setup_articles():
    articleId = 1
    for post in posts:
        query = "INSERT INTO articles (isPublished, pubDate, updateDate, type, title, author, image, excerpt, text, url, assignedEditor) " \
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
        post.articleId = articleId
        articleId += 1
        cur.execute(query, (post.isPublished, post.pubDate, post.updateDate,
                            post.type, post.title, post.author, post.image,
                            post.excerpt, post.text, post.url, "bpettigrew"))
    db.commit()


def setup_events():
    events = get_events()
    for event in events:
        query = "INSERT INTO events (date, description, location, image, fbLink, time, title, film) " \
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
        cur.execute(query, (
            event.date, event.description, event.location, event.image,
            event.fbLink, event.time, event.title, event.film))
    db.commit()


def setup_images():
    for post in posts:
        for image in post.images:
            query = "INSERT INTO images (articleId, image) VALUES (%s, %s)"
            cur.execute(query, (post.articleId, image))
    db.commit()


if __name__ == '__main__':
    reset_databases()
    setup_authors()
    setup_articles()
    setup_images()
    setup_events()
