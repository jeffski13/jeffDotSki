import React, { Component } from 'react';

import { getBlogs } from './GetBlogs';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../Network/consts';
import Loadingski from '../Inf/Loadingski';
import BlogBrowser from './BlogBrowser';

export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            networkStatus: null,
            blogData: null,
            tripId: 'uuid1234'
        }
    }

    componentDidMount() {
        this.setState({
            networkStatus: STATUS_LOADING
        }, () => {

            //get list of blogs by trip name from server
            getBlogs(this.state.tripId, (err, data) => {
                if (err) {
                    console.log(err);
                    this.setState({
                        networkStatus: STATUS_FAILURE,
                        getBlogsResults: {
                            status: err.status,
                            message: err.data.message,
                            code: err.data.code
                        }
                    });
                     return;
                }

                data.sort((trip, nextTrip) => {
                    if (trip.date < nextTrip.date) {
                        return 1;
                    }
                    if (trip.date > nextTrip.date) {
                        return -1;
                    }
                    return 0;
                });

                this.setState({
                    blogData: data,
                    networkStatus: STATUS_SUCCESS
                });
            });
        });
    }

    render() {
        console.log('jeffski in the cage blog list', this.props.blogList);
        let failureMessageRender = (
            <div>Blast! Something went wrong while getting the blogs.</div>
        );
        return (
            <div>
                {this.state.networkStatus === STATUS_LOADING && <Loadingski />}
                {this.state.networkStatus === STATUS_SUCCESS && <BlogBrowser blogsArr={this.state.blogData} />}
                {this.state.networkStatus === STATUS_FAILURE && failureMessageRender}
            </div>
        );

    }

}