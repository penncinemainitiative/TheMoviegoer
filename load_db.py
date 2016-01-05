from os import listdir
import MySQLdb, json

with open('json/mysqldb.json') as data_file:
    data = json.load(data_file)

db = MySQLdb.connect(host=data['host'],
                     user=data['user'],
                     port=int(data['port']),
                     passwd=data['password'],
                     db=data['database'])
cur = db.cursor()

def execute(query):
    cur.execute(query)
    return cur.fetchall()

OLD_POSTS = 'old_posts/'

usernames = {
    "Brad Pettigrew" : "bpettigrew",
    "Nikhil Venkatesa" : "nvenkatesa",
    "Alexander Atienza" : "aatienza",
    "James Sheplock" : "jsheplock",
    "Rahel Tekeste" : "rtekeste",
    "Vaishak Kumar" : "vkumar",
    "Ben Finkel" : "bfinkel",
    "David Lakata" : "dlakata",
    "Ritwik Bhatia" : "rbhatia",
    "PCI" : "pci",
    "Lucas De Barros Silva" : "lsilva",
    "Olatunbosun Osinaike" : "oosinaike",
    "Eric Eisner" : "eeisner",
    "Adelaide Powell" : "apowell"
}

# get rid of url field
class Post(object):
    def __init__(self, title, author, date, excerpt, image, type, text, url):
        self.isPublished = 2
        self.pubDate = date
        self.updateDate = date
        self.type = type
        self.title = title
        self.url = url
        self.author = usernames[author]
        self.image = image
        self.excerpt = excerpt
        self.text = text

def setup_articles():
    posts = get_posts()
    for post in posts:
        query = "INSERT INTO articles (isPublished, pubDate, updateDate, type, title, url, author, excerpt, text) " \
                "VALUES ({}, {}, {}, {}, {}, {}, {}, {}, {})".format(post.isPublished, post.pubDate, post.updateDate, post.type,
                                                                 post.title, post.url, post.author, post.excerpt, post.text)

def setup_authors():
    for author, username in usernames.iteritems():
        print author, username
        query = "INSERT INTO authors (username, email, name, password, isEditor, image, bio) " \
                "VALUES ({}, {}, {}, {}, {}, {}, {})".format(username, "", author, "password", 0,
                                                             "https://www.royalacademy.org.uk/assets/placeholder-1e385d52942ef11d42405be4f7d0a30d.jpg", "...")
        print query

def get_posts():
    posts = []
    for filename in listdir(OLD_POSTS):
        with open(OLD_POSTS + filename, 'r') as f:
            lines = f.readlines()[1:]
            title = get_attr(lines, 'title')
            author = get_attr(lines, 'author')
            date = get_attr(lines, 'date')
            image = get_attr(lines, 'image')
            text = get_attr(lines, 'text')
            excerpt = get_attr(lines, 'excerpt')
            type = get_attr(lines, 'tags')
            url = '/' + filename.replace('-', '/').replace('markdown', 'html')
            post = Post(title, author, date, excerpt, image, type, text, url)
            posts.append(post)
    return posts

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

def get_attr(lines, attr):
    if attr == 'text':
        for i, line in enumerate(lines):
            if line.startswith('--'):
                return ''.join(lines[i+1:])
    elif attr == 'tags':
        for i, line in enumerate(lines):
            if line.startswith(attr):
                return get_tags(lines[i+1:])
    else:
        for line in lines:
            if line.startswith(attr):
                return line.split(attr + ':')[1].strip()

if __name__ == '__main__':
    setup_authors()