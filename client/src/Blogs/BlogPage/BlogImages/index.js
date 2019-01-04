import React from 'react';
import PropTypes from 'prop-types';

import BlogImagesCarousel from './BlogImagesCarousel';
import {Image} from 'react-bootstrap';

import "./blog-image-styles.css";

class BlogImages extends React.Component {
    
    static propTypes = {
        //all of the image data for the blog
        blogImageData: PropTypes.array.isRequired,
        isViewMobile: PropTypes.bool
    };

    renderBlogImageItems = (blogImageItemData, index) => {
        let finalImgUrl = blogImageItemData.midsize;
        if(!finalImgUrl){
            finalImgUrl = blogImageItemData.url;
        }
        return (
            <div 
                className="BlogImages-mobile-responsive-images"
                key={finalImgUrl + index}
            >
                <Image
                    src={finalImgUrl}
                    responsive 
                    />
                <div className="BlogImages-mobile-text">
                    <h4>{blogImageItemData.imageTitle}</h4>
                    <p>{blogImageItemData.imageDescription}</p>
                </div>
            </div>
        );
    }
    
    render() {

        //make sure blog images exist. If not, dont render a darn thing
        if (!this.props.blogImageData || this.props.blogImageData.length === 0) {
            return null;
        }

        if (this.props.isViewMobile) {
            return (
                <React.Fragment>
                    <div className="BlogImages-top-spacer" />
                    <div >
                        {this.props.blogImageData.map(this.renderBlogImageItems)}
                    </div>
                </React.Fragment>
            );
        }
        else { //not at all mobile
            return (
                <React.Fragment>
                    <div className="BlogImages-top-spacer" />
                    <BlogImagesCarousel images={this.props.blogImageData} />
                </React.Fragment>
            );
        }

    }
}

export default BlogImages;