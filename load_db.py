from os import listdir
import MySQLdb, json, os

with open('json/mysqldb.json') as data_file:
    data = json.load(data_file)

db = MySQLdb.connect(host=data['host'],
                     user=data['user'],
                     port=int(data['port']),
                     passwd=data['password'],
                     db="TESTMOVIE")
cur = db.cursor()


def execute(query):
    cur.execute(query)
    return cur.fetchall()


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

execute(
        "CREATE TABLE `authors` (`username` text NOT NULL,`email` text NOT NULL,`name` varchar(100) NOT NULL,`password` varchar(100) NOT NULL,`isEditor` int(11) NOT NULL,`image` text NOT NULL,`bio` text NOT NULL)")
execute(
        "CREATE TABLE `events` (`eventId` int(11) NOT NULL AUTO_INCREMENT, `date` date NOT NULL, `location` text, `image` text, `presenter` varchar(100) DEFAULT NULL, `authorUsername` text, `goingCount` int(11) DEFAULT NULL, `fbLink` varchar(100) DEFAULT NULL, `time` time NOT NULL, `title` varchar(100) NOT NULL, PRIMARY KEY (`eventId`))")
execute(
        "CREATE TABLE `articles` (`articleId` int(11) NOT NULL AUTO_INCREMENT, `isPublished` int(11) NOT NULL, `pubDate` date DEFAULT NULL, `updateDate` date NOT NULL, `type` text NOT NULL, `title` text NOT NULL, `author` text NOT NULL, `image` text, `excerpt` text NOT NULL, `text` text NOT NULL, PRIMARY KEY (`articleId`))")
execute(
        "CREATE TABLE `images` (`image` varchar(200) NOT NULL, `articleId` int(11) DEFAULT NULL)")

OLD_POSTS = 'old_posts/'

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
    "Olatunbosun Osinaike": "oosinaike",
    "Eric Eisner": "eeisner",
    "Adelaide Powell": "apowell"
}


class Post(object):
    def __init__(self, title, author, date, excerpt, image, type, text, images):
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


class Author(object):
    def __init__(self, username, name, image, bio):
        self.username = username
        self.email = ""
        self.name = name
        self.password = "password"
        self.image = image
        self.bio = bio


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
    for dirname, dirnames, filenames in os.walk('old_authors'):
        for filename in filenames:
            with open(os.path.join(dirname, filename)) as f:
                lines = f.readlines()[1:]
                name = get_attr(lines, 'author').replace('"', "")
                username = usernames[name]
                image = get_attr(lines, 'authorimage').replace('"', "")
                bio = get_attr(lines, 'bio').replace('"', "")
                author = Author(username, name, image, bio)
                authors.append(author)
    pci = Author("pci", "PCI", "https://s3.amazonaws.com/moviegoer/uploads/inchoate/writer/M.jpg", "")
    jsheplock = Author("jsheplock", "James Sheplock", "https://s3.amazonaws.com/moviegoer/uploads/inchoate/writer/M.jpg", "")
    bfinkel = Author("bfinkel", "Benjamin Finkel", "https://s3.amazonaws.com/moviegoer/uploads/inchoate/writer/M.jpg", "")
    vkumar = Author("vkumar", "Vaishak Kumar", "https://s3.amazonaws.com/moviegoer/uploads/inchoate/writer/M.jpg", "")
    authors.append(pci)
    authors.append(jsheplock)
    authors.append(bfinkel)
    authors.append(vkumar)
    return authors


def get_posts():
    posts = []
    for filename in listdir(OLD_POSTS):
        with open(OLD_POSTS + filename, 'r') as f:
            lines = f.readlines()[1:]
            title = get_attr(lines, 'title').replace('"', "")
            author = get_attr(lines, 'author').replace('"', "")
            date = get_attr(lines, 'date').replace('"', "")
            image = get_attr(lines, 'image').replace('"', "")
            text = get_attr(lines, 'text').replace('"', "")
            excerpt = get_attr(lines, 'excerpt').replace('"', "")
            type = get_attr(lines, 'tags')
            images = get_attr(lines, 'images')
            # url = '/' + filename.replace('-', '/').replace('markdown', 'html')
            post = Post(title, author, date, excerpt, image, type, text, images)
            posts.append(post)
    return posts


posts = get_posts()


def setup_authors():
    authors = get_authors()
    for author in authors:
        query = "INSERT INTO authors (username, email, name, password, isEditor, image, bio) " \
                "VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cur.execute(query, (
            author.username, "", author.name, "password", 0, author.image,
            author.bio))
    cur.execute("UPDATE authors SET isEditor=1 WHERE username='bpettigrew'")
    db.commit()


def setup_articles():
    articleId = 1
    for post in posts:
        query = "INSERT INTO articles (isPublished, pubDate, updateDate, type, title, author, image, excerpt, text) " \
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        post.articleId = articleId
        articleId += 1
        cur.execute(query, (post.isPublished, post.pubDate, post.updateDate,
                    post.type, post.title, post.author, post.image, post.excerpt, post.text))
    db.commit()


def setup_images():
    for post in posts:
        for image in post.images:
            query = "INSERT INTO images (articleId, image) VALUES (%s, %s)"
            cur.execute(query, (post.articleId, image))
    db.commit()


if __name__ == '__main__':
    setup_authors()
    setup_articles()
    setup_images()
