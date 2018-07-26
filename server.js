'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true } );

var urlSchema = new mongoose.Schema({
  url: String,
  id: Number,
});

var urlModel = mongoose.model('urlModel', urlSchema);


var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:id', function(req, res){
  urlModel.find({id: Number(req.params.id)}).exec(function(err,doc) {
    if (err) res.send('404');
    if (doc) {
      res.redirect(doc[0].url);
    }
  })
});


app.post('/api/shorturl/new', function(req,res) {
  urlModel.countDocuments({},function(err,cnt){
    let newUrl = new urlModel({
      url: req.body.url,
      id: Number(cnt + 1),
    }).save(function(err,doc) {
      if (err) {
        res.send(err);
      }
        res.send({"original_url":req.body.url,"short_url":Number(cnt+1)});
      });
  })
})

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});