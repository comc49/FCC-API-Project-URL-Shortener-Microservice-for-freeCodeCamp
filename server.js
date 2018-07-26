'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");

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
  urlModel.find({id: req.params.id}).exec(function(err,doc) {
    if (err) res.send('404');
    res.redirect(doc);
  })
});


app.post('/api/shorturl/new', function(req,res) {
  console.log("WHAT THE");
  urlModel.count().then(cnt => {
      console.log(req.body.url,cnt)

    let newUrl = new urlModel({
      url: req.body.url,
      id: cnt+ 1,
    }).save(function(err,doc) {
      if (err) res.send('404');
        console.log(doc,'doc');
        res.send("SAVED!");
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