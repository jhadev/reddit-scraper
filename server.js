var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware
app.set('views', './views')
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/reddit";

mongoose.connect(MONGODB_URI);
// Connect to the Mongo DB

// Routes

app.get("/", function (req, res) {
  db.Article.find({})
    .then((dbUser) => {
      res.render('index')
    })
    .catch((err) => {
      res.status(500).json(err)
    })
})

app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://old.reddit.com/r/todayilearned/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);
    
    $("p.title").each(function (i, element) {

      const result = {};

      result.title = $(this)
      .text();
      result.link = $(this)
      .children("a")
      .attr("href");

      db.Article.create(result)
        .then(function (dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function (err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });
    res.redirect('/');
  });
});

app.get("/articles", function (req, res) {
  db.Article.find({})
    .then((dbUser) => {
      res.json(dbUser);
    })
    .catch((err) => {
      res.status(500).json(err)
    })
})

app.get("/articles/:id", (req, res) => {
  db.Article.findById(req.params.id)
    .populate("note")
    .then((dbUser) => {
      res.json(dbUser);
    })
    .catch((err) => {
      res.json(err)
    })
});

app.post("/articles/:id", (req, res) => {
  db.Note.create(req.body)
    .then((dbNote) => {
      return db.Article.findOneAndUpdate({
        _id: req.params.id
      }, {
        note: dbNote._id
      }, {
        new: true
      })
    })
    .then((dbArticle) => {
      res.json(dbArticle)
    })
    .catch((err) => {
      res.json(err)
    })
})

app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});