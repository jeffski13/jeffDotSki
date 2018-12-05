import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Image from 'react-bootstrap/lib/Image';
import moment from 'moment';

import BlogImages from './BlogImages'
import BlogTextItem from './BlogTextItem';
import './styles.css';

export default class BlogPage extends Component {
    static propTypes = {
        blog: PropTypes.object.isRequired
    }

    //renders all paragraphs except the first
    renderRemainingParagraphs = (blogTextItem) => {
        return (
            <BlogTextItem key={blogTextItem._id}
                blogTextData={blogTextItem}
            />
        );
    }

    render() {

        let blog = this.props.blog;

        //get first paragraph data
        //then put the rest of the paragraphs into a separete array
        const firstParagraph = blog.blogContent[0];
        const remainingParagraphs = blog.blogContent.slice(1, blog.blogContent.length);

        return (
            <Grid>
                <Row className="show-grid">
                    <PageHeader>{blog.title}</PageHeader>
                </Row>
                <Row className="show-grid">
                    <div>{blog.location}</div>
                </Row>
                <Row className="show-grid">
                    <div>{moment.unix(blog.date).format("MM/DD/YYYY")}</div>
                </Row>
                <Row className="show-grid blogPargraph">
                    <Col sm={8} md={4} >{firstParagraph.text}</Col>
                    <Col sm={8} md={4} >
                        <Image src={blog.titleImageUrl} responsive />
                    </Col>
                </Row>
                {remainingParagraphs.length > 0
                    ? remainingParagraphs.map(this.renderRemainingParagraphs)
                    : null}

                <Row className="show-grid">
                    <BlogImages blogImageData={blog.blogImages} />
                </Row>
            </Grid>
        );
    }

}
