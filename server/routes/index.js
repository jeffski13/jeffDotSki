var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var TravelBlog = require('../models/TravelBlog.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET /blog listing. */
router.get('/blog', function(req, res, next) {
  console.log("/blog get");
  TravelBlog.find(function (err, blogs) {
    if (err){
      return next(err);
    }
    res.status(200);
    res.json(blogs);
  });
});

/* POST /blogs */
router.post('/blog', function(req, res, next) {
  console.log("/addblog post ", req.body);
  TravelBlog.create(req.body, function (err, post) {
    if (err){
      return next(err);
    }
    res.json(post);
  });
});

/* GET /blog by id. */
router.get('/blog/:id', function(req, res, next) {
  console.log("/blog get id ", req.params.id);
  TravelBlog.findById(req.params.id, function (err, post) {
    if (err){
      return next(err);
    }
    res.json(post);
  });
});

module.exports = router;
