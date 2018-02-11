var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');

var TravelBlogSchema = new mongoose.Schema({
  title: String,
  location: String,
  date: String,
  blogText: [
    {
      text: String,
      list:{
        style: String, //could be number, bullet, etc
        textItems: [
          {
            title: String,
            text: String,
            subText: String,
            style: String //(could be a quote, note, etc.)
          }
        ]
      }
    }
  ]
});


TravelBlogSchema.plugin(autoIncrement.plugin, 'TravelBlog');
module.exports = mongoose.model('TravelBlog', TravelBlogSchema);
