import React from 'react';
import {policy} from './policy';
class AwsForm extends React.Component {

    //produces a message digest, typically SHA-256
    Hash(){
        return null;
    }

    //returns the base-16 encoding of the digest in lowercase characters. 
    // For example, HexEncode("m") returns the value 6d rather than 6D. 
    // Each input byte must be represented as exactly two hexadecimal characters.
    HexEncode(){
        return null;
    }

    render(){
        
        // let HTTPRequestMethod = 'GET';
        // let CanonicalURI = '/blog/chile.json';
        // let CanonicalQueryString = '';
        // let CanonicalHeaders = '';
        // let SignedHeaders = '';

        // let CanonicalRequest =
        //     HTTPRequestMethod + '\n' +
        //     CanonicalURI + '\n' +
        //     CanonicalQueryString + '\n' +
        //     CanonicalHeaders + '\n' +
        //     SignedHeaders + '\n' +
        //     HexEncode(Hash(RequestPayload));


        //trying to get this Sig v4 Signing Process for AWS
        let encodedPolicy = window.btoa(policy);
        let policyStr = JSON.stringify(encodedPolicy);
        console.log('jeffski encoding: ', policyStr);

        let fileName='';
        return(
            <form action="http://jeff.ski.s3.amazonaws.com/" method="post" encType="multipart/form-data">
                Key to upload: 
                <input type="input"  name="key" value={`user/user1/${fileName}`} /><br />
                <input type="hidden" name="acl" value="public-read" />
                <input type="hidden" name="success_action_redirect" value="http://jeff.ski.s3.amazonaws.com/successful_upload.html" />
                Content-Type:
                <input type="input"  name="Content-Type" value="image/jpeg" /><br />
                <input type="hidden" name="x-amz-meta-uuid" value="14365123651274" /> 
                <input type="hidden" name="x-amz-server-side-encryption" value="AES256" /> 
                <input type="text"   name="X-Amz-Credential" value="AKIAJL5MYS7ZMHGFNBKA/20181229/us-east-2/s3/aws4_request" />
                <input type="text"   name="X-Amz-Algorithm" value="AWS4-HMAC-SHA256" />
                <input type="text"   name="X-Amz-Date" value="20181229T000000Z" />
            
                Tags for File: 
                <input type="input"  name="x-amz-meta-tag" value="imgski" /><br />
                <input type="hidden" name="Policy" value={policyStr} />
                <input type="hidden" name="X-Amz-Signature" value="<signature-value>" />
                File: 
                <input type="file"   name="file" /> 
                <br />
                {/* <!-- The elements after this will be ignored --> */}
                <input type="submit" name="submit" value="Upload to Amazon S3" />
            </form>
        );
    }
}

export default AwsForm;