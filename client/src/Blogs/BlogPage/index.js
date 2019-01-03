import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import Image from 'react-bootstrap/lib/Image';
import moment from 'moment';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';

import BlogImages from './BlogImages'
import BlogTextItem from './BlogTextItem';
import './styles.css';
import loadingImage from './loading_image.gif';

export default class BlogPage extends Component {
    static propTypes = {
        blog: PropTypes.object.isRequired
    }

    constructor() {
        super();
        this.state = {
            windowWidth: window.innerWidth,
            hasTitleImageLoaded: false
        };
    }

    componentWillMount() {
        // add a listener for the screen size since we have a mobile view
        window.addEventListener('resize', this.handleWindowSizeChange);
        //configure anchors with offset to account for ever-present header
        configureAnchors({ offset: -60 });
    }

    // make sure to remove the listener for the screen size
    // when the component is not mounted anymore
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ windowWidth: window.innerWidth });
    };

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

        //is it time to go mobile? if so, get smaller image
        let finalTitleImgUrl = blog.titleImageUrl //#YOLOSWAG - take out the check for blog.titleImage. Right now most dont have this, in the future they all should 
        if (this.state.windowWidth <= 650 && blog.titleImage) { //for now check to see if titleImage exists
            finalTitleImgUrl = blog.titleImage.midsize;
        }

        //a little haxxy to make the image responsive and hidden when needed
        let titleImageClass =  'img-responsive';
        if(!this.state.hasTitleImageLoaded) {
            titleImageClass = 'BlogPage_loadingImage img-responsive';
        }
        return (
            <Grid>
                <Row className="show-grid">
                <ScrollableAnchor id={this.props.invisibleAnchorId}>
                    <PageHeader>{blog.title}</PageHeader>
                </ScrollableAnchor>
                </Row>
                <Row className="show-grid">
                    <div>{blog.location}</div>
                </Row>
                <Row className="show-grid">
                    <div>{moment.unix(blog.date).format("MM/DD/YYYY")}</div>
                </Row>
                <Row className="show-grid blogPargraph">
                    <Col className="BlogPage__first-paragraph" sm={8} md={4} >{firstParagraph.text}</Col>
                    <Col sm={8} md={4} >
                        <img 
                            onLoad={() => {
                                this.setState({
                                    hasTitleImageLoaded: true
                                })
                            }} 
                            id={blog.id + '-title-image'} 
                            src={finalTitleImgUrl}
                            className={titleImageClass}
                            alt={`${blog.title} Main`}
                        />
                        {!this.state.hasTitleImageLoaded && <Image src={loadingImage} responsive />}
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
