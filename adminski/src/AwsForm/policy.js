export let policy = { "expiration": "2018-12-30T12:00:00.000Z",
    "conditions": [
      {"bucket": "jeff.ski"},
      ["starts-with", "$key", "user/user1/"],
      {"acl": "public-read"},
      {"success_action_redirect": "http://jeff.ski.s3-website.us-east-2.amazonaws.com/"},
      ["starts-with", "$Content-Type", "image/"],
      {"x-amz-meta-uuid": "14365123651274"},
      {"x-amz-server-side-encryption": "AES256"},
      ["starts-with", "$x-amz-meta-tag", ""],
  
      {"x-amz-credential": "AKIAJL5MYS7ZMHGFNBKA/20181229/us-east-2/s3/aws4_request"},
      {"x-amz-algorithm": "AWS4-HMAC-SHA256"},
      {"x-amz-date": "20181229T000000Z" }
    ]
}