import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';

import BlogPage from './BlogPage';
import './styles.css';

export default class BlogList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blogs: [],
            dateDescending: true
        };
    }

    componentDidMount() {
        console.log('jeffski mounting component with ', this.props.blogs);
        this.state.blogs = this.props.blogs;
        this.sortBlogsByDate(this.state.dateDescending);
    }

    sortBlogsByDate = (shouldDescend) => {
        let sortingHatSwitch = -1;
        if (shouldDescend) {
            sortingHatSwitch = 1;
        }
        let sortedBlogsArr = this.state.blogs;

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
            blogs: sortedBlogsArr,
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
        if (!this.state.blogs) {
            return null;
        }
        return (
            <div className="BlogList">
                <Row className="show-grid">
                    <Col xs={12} md={12}>
                        <div className="Blogs-controls">
                            <span className="BlogList-dateSortControls">Date Order: </span>
                            <ButtonGroup>
                                <Button
                                    bsSize="xsmall"
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
                                    bsSize="xsmall"
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
                    </Col>
                </Row>

                {this.state.blogs.map(this.renderSampleBlogItem)}
            </div>
        );

    }

}