---
title: Graceful shutdown with Mongoose, and basic logging
date: Mar 12, 2016
url: mongoose-graceful-shutdown
tags:
  - Mongoose
  - MongoDB
  - heroku
  - copypasta
publish: true
---

Right now I am in the process of completing
<a  href="http://www.amazon.com/gp/product/1617292036/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1617292036&linkCode=as2&tag=wahidsblog-20&linkId=7L2BB6YKPFE4FGVG">Getting MEAN with Mongo, Express, Angular, and Node</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=wahidsblog-20&l=as2&o=1&a=1617292036" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
.
In chapter 5, it goes over monitoring database connections using mongoose
connection events, and node process signals; this allows gracefully closing the
database connection when the app closes/restarts.

<br>
This is done by listening to Node processes. The three processes focused on are:

1. Nodemon restart
2. App termination
3. Heroku app termination

These processes uses different signals: `SIGUSR2`, `SIGINT`, `SIGTERM` (respectively).
The code below is taken from the book. The reason I am sharing this because,
it is a reusable/configurable piece of code that can be used for any application
using MongoDB with Mongoose.

<br>
It should be grouped with your other model/schema definitions,
and be called during the startup of your application, by adding `require('./models/db.js')`
somewhere in the beginning of the `app.js` file.

```javascript
// db.js
var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost'

// using Herokus mongolab database uri
// this environment variable is available in the
// Heroku environment after installing Mongolab
if (process.env.NODE_ENV === 'production')
  dbURI = process.env.MONGOLAB_URI

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error:' + err);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

var gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
}

// listening to node processes for termination or
// restart signals, and call gracefulShutdown(),
// passing a continuation callback
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', function() {
  gracefulShutdown('app termination', function() {
    process.exit(0);
  });
});
process.on('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function() {
    process.exit(0);
  });
});

// here you can require your mongoose model schema file
require('./model');
```

I found this to be really useful. Especially when having problems with heroku databases,
this helped me successfully debug heroku/remote-database related problems.

<br>
If you learn by building, and interested in the MEAN stack, you should
definitely check out
<a  href="http://www.amazon.com/gp/product/1617292036/ref=as_li_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=1617292036&linkCode=as2&tag=wahidsblog-20&linkId=UOA3ZKHJQWFXSXZV">Getting MEAN with Mongo, Express, Angular, and Node</a><img src="http://ir-na.amazon-adsystem.com/e/ir?t=wahidsblog-20&l=as2&o=1&a=1617292036" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
.
