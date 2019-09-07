import { AUTH_CONFIG } from './aws-auth-config';

export const STORAGE_PROTECTED_PREFIX = `https://s3.${AUTH_CONFIG.Storage.AWSS3.region}.amazonaws.com/jeff.ski.blogski/protected`;

export const getProtectedStorageUrlFromUser = user => {
    /*
    Properties of user.storage will look something like this:
    aws.cognito.identity-id.us-east-2:7c930145-0b05-4a33-8b27-c480affcaa89: "us-east-2:81090a72-b8ab-4200-b3c5-2f3f966b626b"
    aws.cognito.identity-id.us-east-2:31157a64-5cb8-4289-91da-63e3623cf7e8: "us-east-2:a5f6f03f-6c36-492e-bc22-25a1f2f8ced1"
    aws.cognito.identity-providers.us-east-2:31157a64-5cb8-4289-91da-63e3623cf7e8: "cognito-idp.us-east-2.amazonaws.co
    */
    //get this key: aws.cognito.identity-providers.us-east-2 (full is "aws.cognito.identity-providers.us-east-2:31157a64-5cb8-4289-91da-63e3623cf7e8")
    //and from that key get the last part of it (31157a64-5cb8-4289-91da-63e3623cf7e8)
    //then use that to construct the key "aws.cognito.identity-id.us-east-2:31157a64-5cb8-4289-91da-63e3623cf7e8" 
    // which will give you the value of the url after /protected/ and before the /{sub}/ ("us-east-2:a5f6f03f-6c36-492e-bc22-25a1f2f8ced1")
    // turn that ish into a URL
    const storageKeysArr = Object.keys(user.storage);
    const S3_PROPERTY_PREFIX = `aws.cognito.identity-providers.${AUTH_CONFIG.Storage.AWSS3.region}:`
    let keyContainingS3UrlProperty = '';
    for (let i = 0; i < storageKeysArr.length; i++) {
        const nextKey = storageKeysArr[i];
        if (nextKey.startsWith(S3_PROPERTY_PREFIX)) {
            keyContainingS3UrlProperty = nextKey;

            break;
        }
    }
    if (!keyContainingS3UrlProperty) {
        console.error('No protected URL found');
        return '';
    }
    const s3StorageUrlPropertySuffix = `${keyContainingS3UrlProperty.replace(S3_PROPERTY_PREFIX, '')}`;
    const urlPropertyKey = `aws.cognito.identity-id.${AUTH_CONFIG.Storage.AWSS3.region}:${s3StorageUrlPropertySuffix}`;
    const s3StorageProtectedUrl = user.storage[urlPropertyKey];
    return encodeURI(s3StorageProtectedUrl);
};