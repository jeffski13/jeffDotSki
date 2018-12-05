import React, { Component } from 'react';
import { Grid, ButtonGroup, Button } from 'react-bootstrap';

import BlogPage from './BlogPage';
import { getBlogs } from './GetBlogs';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../Network/consts';
import Loadingski from '../Inf/Loadingski';
import './styles.css';

export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            networkStatus: null,
            blogsArr: null,
            tripId: 'uuid1234',
            dateDescending: true
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

                this.setState({
                    blogsArr: data,
                    networkStatus: STATUS_SUCCESS
                }, () => {
                    //do initial date sort for blogs
                    this.sortBlogsByDate(this.state.dateDescending);
                });
            });
        });
    }

    sortBlogsByDate = (shouldDescend) => {
        let sortingHatSwitch = -1;
        if (shouldDescend) {
            sortingHatSwitch = 1;
        }
        let sortedBlogsArr = this.state.blogsArr;

        sortedBlogsArr.sort((trip, nextTrip) => {
            if (trip.date < nextTrip.date) {
                return 1 * sortingHatSwitch;
            }
            if (trip.date > nextTrip.date) {
                return -1 * sortingHatSwitch;
            }
            return 0;
        });

        this.setState({
            blogsArr: sortedBlogsArr,
            dateDescending: shouldDescend
        });

    }

    //renders all paragraphs except the first
    renderSampleBlogItem = (nextBlog) => {
        return (
            <BlogPage key={nextBlog.createdAtDate}
                blog={nextBlog}
            />
        );
    }


    render() {
        console.log('jeffski in the cage blog list', this.props.blogList);
        let failureMessageRender = (
            <div>Blast! Something went wrong while getting the blogs.</div>
        );
        let blogsArea = null;
        if (this.state.blogsArr) {
            blogsArea = (
                <div className="Blogs">
                    <Grid>
                        <div className="blogBrowserTitle">
                            <div>Chile</div>
                            <div>
                                <ButtonGroup>
                                    <Button
                                        disabled={this.state.dateDescending}
                                        onClick={() => {
                                            this.sortBlogsByDate(true);
                                        }}
                                    >
                                        <i class="material-icons">
                                            arrow_downward
                                        </i>
                                    </Button>
                                    <Button
                                        disabled={!this.state.dateDescending}
                                        onClick={() => {
                                            this.sortBlogsByDate(false);
                                        }}
                                    >
                                        <i class="material-icons">
                                            arrow_upward
                                        </i>
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        {this.state.blogsArr.map(this.renderSampleBlogItem)}
                    </Grid>
                </div>
            );
        }
        return (
            <div>
                {this.state.networkStatus === STATUS_LOADING && <Loadingski />}
                {this.state.networkStatus === STATUS_SUCCESS && blogsArea}
                {this.state.networkStatus === STATUS_FAILURE && failureMessageRender}
            </div>
        );

    }

}