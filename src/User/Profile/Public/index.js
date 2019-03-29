import React from 'react';
import { STATUS_FAILURE, STATUS_LOADING, STATUS_SUCCESS  } from '../../../Network/consts';
import {getBlogUserSecure} from '../../BlogUser';

export default class PublicProfile extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            networkStatus: null
        }
    }

    componentDidMount() {
        this.setState({
            networkStatus: STATUS_LOADING
        }, () => {
            //if user provides trip id in the the path use it to look up blogs
            if (!this.props.match.params.userId) {
                return this.setState({
                    networkStatus: STATUS_FAILURE
                });
            }
            let userId = this.props.match.params.userId;
            console.log('userid is ', userId);
            
            getBlogUserSecure(userId, (err, data) => {
                if (err) {
                    console.log('trip error returned', err);
                    return this.setState({
                        networkStatus: STATUS_FAILURE,
                        getTripResults: {
                            status: err.status,
                            message: err.data.message,
                            code: err.data.code
                        }
                    });
                }
                console.log('trip data returned', data);
                this.setState({
                    tripName: data.name,
                    networkStatus: STATUS_SUCCESS
                });
            });
            
        });
    }

    render() {
        return (<div>
            Public Profile
        </div>);
    }
}