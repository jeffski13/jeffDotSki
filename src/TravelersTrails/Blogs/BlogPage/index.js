import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import BlogImages from './BlogImages';
import EditBlog from './creation/EditBlog';
import BlogTextItem from './BlogTextItem';
import {startEditBlog} from './creation/actions';
import './styles.css';
import loadingImage from '../../../loading_image.gif';

class BlogPage extends Component {

    constructor() {
        super();
        this.state = {
            hasTitleImageLoaded: false
        };
    }

    componentWillMount() {
        //configure anchors with offset to account for ever-present header
        configureAnchors({ offset: -60 });
    }

    componentDidMount() {
        //magic from MDN to know when element is on screen
        let observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: []
        };

        let thresholdSets = [
            [],
            [0.5],
            [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            [0, 0.25, 0.5, 0.75, 1.0]
        ];

        for (let i = 0; i <= 1.0; i += 0.01) {
            thresholdSets[0].push(i);
        }

        let percentageInViewCallback = this.props.percentageInViewCallback;
        let blogId = this.props.blog.id;
        observerOptions.threshold = thresholdSets[0];
        let blogObserver = new IntersectionObserver((entries) => {
            entries.forEach(function (entry) {
                let visiblePct = Math.floor(entry.intersectionRatio * 100);
                percentageInViewCallback(visiblePct, blogId);
            });
        }, observerOptions);
        blogObserver.observe(document.querySelector("#" + this.props.blogAnchorId));
    }

    editBlogClicked = () => {
        this.props.startEditBlog(this.props.blog);
    }

    //renders all paragraphs except the first
    renderRemainingParagraphs = (blogTextItem, index) => {
        return (
            <BlogTextItem
                key={this.props.blog.id + '-textItem-' + index}
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
        if (this.props.isViewMobile && blog.titleImage) { //for now check to see if titleImage exists
            finalTitleImgUrl = blog.titleImage.midsize;
        }

        //a little haxxy to make the image responsive and hidden when needed
        let titleImageClass = 'img-responsive';
        if (!this.state.hasTitleImageLoaded) {
            titleImageClass = 'BlogPage_loadingImage img-responsive';
        }
        if(this.props.blogCreation.isEdittingBlog && this.props.blogCreation.id === this.props.blog.id){
            return <EditBlog
                OGBlogInfo={this.props.blog}
            />
        }

        return (
            <Container id={this.props.blogAnchorId} >
                <Row className="show-grid">
                    <ScrollableAnchor id={this.props.invisibleAnchorId}>
                        <h3>{moment.unix(blog.date).format("MM/DD/YYYY")}</h3>
                    </ScrollableAnchor>
                </Row>
                <Row className="show-grid">
                    <h3>{blog.title}</h3>
                </Row>
                <Row className="show-grid">
                    <div>{blog.location}</div>
                </Row>
                {/* Title image and first paragraph side-by-side */}
                <Row className="show-grid blogPargraph"> 
                    <Col className="BlogPage__first-paragraph" sm={8} md={4} >{firstParagraph.text}</Col>
                    <Col sm={8} md={4} >
                        <Image
                            fluid
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
                        {!this.state.hasTitleImageLoaded && <Image src={loadingImage} fluid />}
                    </Col>
                    {/* edit blog controls */}
                    {this.props.isEditEnabled &&
                        !this.props.blogCreation.isEdittingBlog && 
                        <Col sm={1}>
                            <span className="Blogs_tripTitleEditButton">
                                <Button
                                    onClick={this.editBlogClicked}
                                    variant="secondary"
                                    disabled={this.props.isDisabled} //should hook into redux state for this
                                    title="Please finish editting your blog."
                                >
                                    <i className="material-icons">edit</i>
                                </Button>
                            </span>
                        </Col>
                    }
                </Row>
                {remainingParagraphs.length > 0
                    ? remainingParagraphs.map(this.renderRemainingParagraphs)
                    : null}

                <Row className="show-grid">
                    <BlogImages
                        blogImageData={blog.blogImages}
                        isViewMobile={this.props.isViewMobile}
                    />
                </Row>
            </Container>
        );
    }
}

BlogPage.propTypes = {
    blog: PropTypes.object.isRequired,
    isViewMobile: PropTypes.bool,
    blogsViewMode: PropTypes.string,
    isEditEnabled: PropTypes.bool
}

BlogPage.defaultProps = {
    isEditEnabled: false,
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        startEditBlog
    }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogPage);