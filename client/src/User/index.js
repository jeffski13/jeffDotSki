import React from 'react';
import './styles.css';

export default class User extends React.Component {
    //callback page for
    // https://jeffskiblog.auth.us-east-2.amazoncognito.com/login?response_type=token&client_id=ve30037id36g8m4q811kmnqfs&redirect_uri=https://jeff.ski/blog/chile
    render(){
        return (
            <div className="User">
                <div>User Page</div>
            </div>
        )
    }
}