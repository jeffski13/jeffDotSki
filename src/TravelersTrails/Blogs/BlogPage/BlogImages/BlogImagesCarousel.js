import React from 'react';
import PropTypes from 'prop-types';
import ImageGallery from 'react-image-gallery'
import "react-image-gallery/styles/css/image-gallery.css";
import './styles.css';
export default class BlogImagesCarousel extends React.Component {
    static propTypes = {
        // array of image data:
        // {
        //   rawUrl: string
        //   thumbUrl: string
        // }
        images: PropTypes.array.isRequired
    }

    constructor(props){
        super(props);
        this.state = {
            currentImageIndex: 0
        }
    }
    
    render() {
        const images = this.props.images;
        const imageUrls = [];

        images.map((nextImageItem)=>{
            imageUrls.push({
                original: nextImageItem.url,
                thumbnail: nextImageItem.thumbnailUrl,
                originalTitle: nextImageItem.imageTitle,
                thumbnailTitle: nextImageItem.imageTitle
            });
            return null; //lint wants to name sure if we error in here that we render something (in this case null)
        })
        return (
            <div>
                <div className="BlogImagesCarousel-text-wrapper" >
                    <div className="BlogImagesCarousel-text">
                        <div className="BlogImagesCarousel-text-title" ><strong>{this.props.images[this.state.currentImageIndex].imageTitle}</strong></div>  
                        <div>{this.props.images[this.state.currentImageIndex].imageDescription}</div>
                    </div>
                </div>
                <ImageGallery 
                    thumbnailPosition="bottom" 
                    items={imageUrls} 
                    onSlide={(index) => {
                        this.setState({
                            currentImageIndex: index
                        });
                    }} 
                />
            </div>
        );
    }
}