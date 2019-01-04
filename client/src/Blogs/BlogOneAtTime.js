import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';

import BlogPage from './BlogPage';
import {VIEW_MODE_ONE} from '../Blogs';
import './styles.css';

export default class BlogOneAtTime extends Component {

    static propTypes = {
        isViewMobile: PropTypes.bool,
        blogs: PropTypes.array.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            blogs: [],
            blogSelectedIndex: 0
        };
    }

    componentDidMount() {
        //get blogs from props then sort them for rendering
        this.setState({
            blogs: this.props.blogs
        }, () => {
            this.sortBlogsByDate();
        });
    }

    sortBlogsByDate = () => {
        let sortedBlogsArr = this.state.blogs;

        sortedBlogsArr.sort((trip, nextTrip) => {
            if (trip.date < nextTrip.date) {
                return -1;
            }
            if (trip.date > nextTrip.date) {
                return 1;
            }
            return 0;
        });

        this.setState({
            blogs: sortedBlogsArr
        });

    }

    render() {
        if (!this.state.blogs || this.state.blogs.length === 0) {
            return null;
        }

        let previousLink = null;
        if (this.state.blogSelectedIndex > 0) {
            previousLink = (
                <button onClick={() => {
                    this.setState({ blogSelectedIndex: this.state.blogSelectedIndex - 1 })
                    window.scrollTo(0, 0);
                }} >Previous: {this.state.blogs[this.state.blogSelectedIndex - 1].title}</button>
            );
        }
        let nextLink = null;
        if (this.state.blogSelectedIndex < this.state.blogs.length - 1) {
            nextLink = (
                <button onClick={() => {
                    this.setState({ blogSelectedIndex: this.state.blogSelectedIndex + 1 })
                    window.scrollTo(0, 0);
                }} >Next: {this.state.blogs[this.state.blogSelectedIndex + 1].title}</button>
            );
        }

        let blogNavigationControls = (
            <Row className="show-grid">
                <Col xs={6} md={3}>
                    {previousLink}
                </Col>
                <Col xs={0} md={6}></Col>
                <Col xs={6} md={3}>
                    <div className="Blogs-controls">
                        {nextLink}
                    </div>
                </Col>
            </Row>
        );

        return (
            <div className="BlogOneAtTime" >
                {blogNavigationControls}
                <div className="BlogOneAtTime-blog">
                    <BlogPage 
                        key={this.state.blogs[this.state.blogSelectedIndex].id} 
                        blog={this.state.blogs[this.state.blogSelectedIndex]} 
                        isViewMobile={this.state.isViewMobile}
                        blogsViewMode={VIEW_MODE_ONE}
                    />
                </div>
                {blogNavigationControls}
            </div>
        );

    }

}