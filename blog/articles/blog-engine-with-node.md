---
title: Simple static blog engine with Node and Express
date: Feb 26, 2016
url: node-static-blog-tutorial
tags:
  - node
  - express
  - javascript
  - tutorial
publish: true
---

In this tutorial we are going to build a simple blog engine with the following specifications
for blog articles:

- articles are written in markdown
- articles are stored in a local folder
- articles have meta data (front-matter)

The blog engine itself will:

- store the articles in an array on startup
- serve the article content in HTML

This will be pretty simple to build, but the result is a very useable and extensible
blog engine. Let's get started.

### Requirements
1. [node.js](https://nodejs.org/en/download/)
2. [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm)
3. express.js `npm install express -g`

Let's create our app directory, install dependencies, and start the server:

```bash
express blog
cd blog
npm install
node bin/www
```

Visiting `localhost:3000` we should get the basic "welcome to express" page.
This page should list all the articles.

First we should create at least one article `an-article.md`:

```markdown
---
title: The first article
date: Friday, February 26, 2016
author: Biff Wellington
---

# This is the first post
It is written in **Markdown**
*A needless haiku*
```

We will store the articles in `_articles` folder in the app directory.
So now we should have one article in our articles folder: `blog/_articles/an-article.md`

Our next step is to be able to see the title, date, and author data of the article when we visit the root path.
Since the root path is handled by the 'routes' variable which is an express.Router being
exported from `blog/routes/index.js` we are going to make modifications on this file. We
also need a way of separating the fron matter data, and rendering the markdown into html. We need to install
the following packages to do this easily:

```bash
npm i front-matter -S
npm i marked -S
```

With these two packages install, we are ready to start serving articles.
First let's load the articles from `_articles` folder (on startup). Edit the `routes/index.js`
to add the following before `router.get('/')`:

```javascript
var fs = require('fs');
var fm = require('front-matter');
var marked = require('marked');

var articles = [];
var files = fs.readdirSync('_articles');

files.map(function(file) {
  var original = fs.readFileSync('_articles/' + file, 'utf8');
  var article = fm(original);

  article.body = marked(article.body);
  articles.push(article);
});
```

Let's go through what we are doing here:

1. we create an empty array to store the articles `var articles = [];`
2. read the articles folder for all files `fs.readdirSync('_articles');`
3. process each file `files.map(function(file {...}))`
4. read the raw content of the file `var original = fs.readFileSync('_articles/' + file, 'utf8');`
5. separating the front-matter data `var article = fm(original);`
6. converting the article body from markdown to html `article.body = marked(article.body);`
7. storing the article in the array `articles.push(article);`

With our articles array full of formatted articles, now we can now show the list of articles.
However, each article is in the form of:

```json
{
  attributes: {
    title: 'The first article',
    date: ...,
    ...
  }
  body: '<p>This is the first post...'
}
```

and we want to pass just the attributes, to our views to list the title date etc, there is no
reason to send the whole article itself (just yet).

Let's edit the `router.get('/')` method:

```javascript
router.get('/', function(req, res, next) {
  var article_list = articles.map(function(article) {
    return article.attributes;
  });

  res.render('index', {articles: article_list});
});
```

Here we are creating a article\_list variable that only has the **attributes**, of each articles in the
main articles array. We are passing this list as 'articles' to the view `views/index.jade`.

And in the view we can render all the articles like this:

```jade
extends layout

block content
  each article in articles
    .article
      - var url = article.title.split(' ').join('-')
      a(href=url)
        h3= article.title
      span by #{article.author}
      br
      span posted: #{article.date}
```

Now we need a way to be able to fetch the article when the user clicks the article link. Since the link
is being generated from the article title, we simply need to match the url parameter with an existing articles
title to know which article to send. To do this we need to add a new `router.get()` method:

```javascript
router.get('/:slug', function(req, res) {
  var article = getArticle(req.params.slug);

  res.render('article', {article: article});
});

function getArticle(title) {
  var t1 = title.split('-').join(' ').toLowerCase();

  for (var i = 0; i < articles.length; i++) {
    var t2 = articles[i].attributes.title.toLowerCase();

    if (t1 === t2) return articles[i];
  }
}
```

Here we respond to the `/:slug` path, where `:slug` is simply the article title concatenated with dashes.
We find the article, by comparing the slug and articles title. If a match is found we return it.

And now you have a *very simple* blog engine, that serves articles written in markdown and has support for
front-matter data.

This was the starting point for my static blog engine [Carpet](http://carpetblog.herokuapp.com) which I am
using right now to serve you this article!
