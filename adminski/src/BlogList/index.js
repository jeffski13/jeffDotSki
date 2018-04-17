import React from 'react';
import moment from 'moment';
import './styles.css';

class BlogList extends React.Component {
    renderBlog(blogItem){
        return(
            <div className="blog">
                <div>Title: {blogItem.blogPostBody.title}</div>
                <div>Location: {blogItem.blogPostBody.location}</div>
                <div>Date: {moment.unix(blogItem.blogPostBody.date).format("MM/DD/YYYY")}</div>
                <div>Text: {blogItem.blogPostBody.blogtext}</div>
            </div>
        );
    }

    render(){
        return(
            <div>
                {this.props.blogsArr.map(this.renderBlog)}
            </div>
        );
    }
}

export default BlogList;