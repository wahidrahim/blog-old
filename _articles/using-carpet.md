---
title: How to use Carpet blog engine
date: Feb 22, 2016
tags:
  - carpet
  - tutorial
<!--publish: true-->
---

Carpet is a simple static blog engine, that lists and views articles written in markdown.

To use carpet, simply clone it from the git repository from

https://github.com/wahidrahim/carpet

```bash
git clone https://github.com/wahidrahim/carpet
cd carpet
npm install
```

Once all the required modules are installed, you can run it using node or npm.

```bash
npm start
# or
node bin/www
```

By default Carpet runs on port 3000, however if you want to run it on a different port,
(eg. 1337) you can run:

```bash
PORT=1337 npm start
```

Now visit `localhost:1337` to see Carpet running. You should see the articles posted
frm the `_articles/` folder, the ones that are specified as `publish: true`.

#### How to compose new articles

When I built Carpet, I wanted something similar to Jekyll. I liked being able to simply
edit markdown files, and use front-matter for metadata.

Carpet has two required front-matter attributes: `title` and `date`, they must exist and be
valid or the server wont start, you will get an error message such as this:

```bash
Error: Article must have a valid date front-matter data. FILE: this-is-a-draft.md
```

To publish a new article, you must have a `title`, a valid `date`, and the `publish` parameter
must be set to `true` (otherwise it is counted as a draft, and will not show up on the list).

Here is a sample new article:

```markdown
---
title: a new article is composed
date: Tuesday, December 25, 2032
publish: true
---

Welcome to the future!
```
By default, Carpet makes the url for the articles by joining the words in the title with a dash.
However you can also have [custom urls](/blog/article/omgomgomg-wut-sweet-url-dis-is) for your article,
by simply adding a url parameter in your article front-matter data.
