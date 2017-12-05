var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var TravelBlogSchema = new mongoose.Schema({
  title: String,
  location: String,
  date: String,
  blogText: [{
    title: String,
    text: String,
    subText: String,
    style: String //defaults to paragraph (paragraph or note or quote or number or bullet)
  }]
});

TravelBlogSchema.plugin(autoIncrement.plugin, 'TravelBlog');
module.exports = mongoose.model('TravelBlog', TravelBlogSchema);
