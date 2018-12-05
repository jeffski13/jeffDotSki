import React from 'react';
import PropTypes from 'prop-types';

import {Grid} from 'react-bootstrap';
import BlogPage from '../BlogPage';
import './styles.css';
export default class BlogBrowser extends React.Component {
    static propTypes = {
        //all of the data for the blogs (images, text, etc.)
        blogsArr: PropTypes.array.isRequired,
    };

    //renders all paragraphs except the first
    renderSampleBlogItem = (nextBlog) => {
        return (
            <BlogPage key={nextBlog.createdAtDate}
                blog={nextBlog}
            />
        );
    }

    render() {
        //order blogs by date
        if (!this.props.blogsArr || this.props.blogsArr.length === 0) {
            return null;
        }

        return (
            <div className="BlogBrowser">
                <Grid>
                    <div className="blogBrowserTitle">
                        Chile
                    </div>
                    {this.props.blogsArr.map(this.renderSampleBlogItem)}
                </Grid>
            </div>
        );
    }
}