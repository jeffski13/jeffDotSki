import React, { Component } from 'react';
import { Grid, Row, Col, ButtonGroup, Button } from 'react-bootstrap';

import BlogList from './BlogList';
import BlogOneAtTime from './BlogOneAtTime';
import { getBlogs } from './GetBlogs';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../Network/consts';
import Loadingski from '../Inf/Loadingski';
import './styles.css';

const VIEW_MODE_LIST = "VIEW_MODE_LIST";
const VIEW_MODE_ONE = "VIEW_MODE_ONE";
export default class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            networkStatus: null,
            blogsArr: null,
            tripId: 'uuid1234',
            viewMode: VIEW_MODE_ONE        };
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
                });
            });
        });
    }

    changeViewStyle = (newViewMode) => {
        if (newViewMode === VIEW_MODE_LIST || newViewMode === VIEW_MODE_ONE) {
            this.setState({
                viewMode: newViewMode
            });
        }
    }

    render() {
        let failureMessageRender = (
            <div>Blast! Something went wrong while getting the blogs.</div>
        );
        let blogsArea = null;
        let blogsViewComponentOptions = {
            VIEW_MODE_LIST: BlogList,
            VIEW_MODE_ONE: BlogOneAtTime
        };
        let BlogsViewComponent = blogsViewComponentOptions[this.state.viewMode];
        if (this.state.blogsArr) {
            blogsArea = (
                <div className="Blogs">
                    <Grid>
                        <Row className="show-grid">
                            <Col xs={12} md={6}>
                                <div className="blogBrowserTitle">Chile</div>
                            </Col>
                            <Col xs={12} md={6}>
                                <div className="Blogs-controls">
                                    <ButtonGroup>
                                        <Button
                                            disabled={this.state.viewMode === VIEW_MODE_LIST}
                                            onClick={() => {
                                                this.changeViewStyle(VIEW_MODE_LIST);
                                            }}
                                        >
                                            <i class="material-icons">dehaze</i>
                                        </Button>
                                        <Button
                                            disabled={this.state.viewMode === VIEW_MODE_ONE}
                                            onClick={() => {
                                                this.changeViewStyle(VIEW_MODE_ONE);
                                            }}
                                        >
                                            <i class="material-icons">crop_square</i>
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </Col>
                        </Row>
                        <BlogsViewComponent blogs={this.state.blogsArr} />
                    </Grid>
                </div >
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