//nice vid: https://www.youtube.com/watch?v=G_-aEXmluq8
console.log('starting guistbook ducntion');

const awsSDK = require('aws-sdk');
const guestBookClient = new awsSDK.DynamoDB.DocumentClinet({region: 'us-east-2'});

exports.handle = function(e, context, callback){
  var parameters = {
    Item: {
      itHappenedNow: Date.now(),
      textski: "It was terrible, we loved it!"
    },

    TableName: 'guestBookTableski'
  };

  guestBookClient.put(parameters, function(err,data){
    if(err){
      callback(err, null);
    }
    else{
      callback(null, data);
    }
  });
}