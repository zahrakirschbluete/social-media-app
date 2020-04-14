const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require('connect-flash');
const markdown = require('marked');
const app = express();
const sanitizteHTML = require('sanitize-html');

let sessionOptions = session({
  secret: "aloha",
  store: new MongoStore({
    client: require("./db"),
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  },
});

app.use(sessionOptions);
app.use(flash());

app.use((req, res, next) => {
  // make our markdown function available from within ejs templates
  res.locals.filterUserHTML = function (content) {
    return sanitizteHTML(markdown(content), {
      allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'bold', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
      allowedAttributes: {}
    })
  }
  // make all error and success flash messages available for all view templates
  res.locals.errors = req.flash('errors')
  res.locals.success = req.flash('success')
  //make current user id available on the current request object
  if (req.session.user) {
    req.visitorId = req.session.user._id
  } else {
    req.visitedId = 0
  }
  //make user session  data available from within view templates
  res.locals.user = req.session.user;
  next();
})

const router = require("./router");

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use(express.static("public"));
app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
