import { AWS_S3_BUCKET_NAME } from '../configski';

//please provide the following:
// file - photo file
// tripName - name of the trip for this photo
// awsClient - s3 sdk object
// callback(error, data) - function with error/data information from s3
export function uploadPhoto(file, tripName, awsS3client, callback) {
    let fileName = file.name;
    let blogImageUploadKey = `blog/${tripName}/${fileName}`;

    //upload photo
    let s3Params = {
        Key: blogImageUploadKey,
        Body: file,
        Bucket: AWS_S3_BUCKET_NAME,
        ACL: 'public-read'
    };

    awsS3client.upload(s3Params, (err, data) => {
        callback(err, data);
    });
}

//get all objects in the AWS S3 blogs "directory"
// s3bucket - the name of the s3 bucket we need to access
// awsS3Client - the s3 sdk object
// callback(error, blogObjectsArr) - a function that will have the blog objects (or an error)
export function fetchBlogObjects(awsS3Client, callback) {
    let s3Params = { Bucket: AWS_S3_BUCKET_NAME };
    awsS3Client.listObjects(s3Params, (err, data) => {
        if (err) {
            callback(err);
        }
        else {
            //you got data! wonderful, now put it into a readable array
            let rawContentsArr = data.Contents;

            //turn into string array of directories
            let directoriesKeyArr = [];
            rawContentsArr.forEach(function (contentsItem) {
                directoriesKeyArr.push(contentsItem.Key);
            });
            let blogDirectoriesArrRaw = directoriesKeyArr.filter(directoryKey => directoryKey.startsWith("blog/"));
            callback(null, blogDirectoriesArrRaw);
        }
    });
}