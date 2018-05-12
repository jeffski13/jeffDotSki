import React from 'react';
import moment from 'moment';

import BlogTextItem from './BlogTextItem';
import './styles.css';

class BlogList extends React.Component {

    constructor(props) {
        super(props);

        this.renderBlog = this.renderBlog.bind(this);
        this.renderBlogtextItem = this.renderBlogtextItem.bind(this);
    }

    renderBlogtextItem(blogPostBody) {
        return (
            <BlogTextItem
                blogTextData={blogPostBody}
            />
        );
    }

    //render each blog here
    // show Title, Location, Date, and 
    renderBlog(blogItem, index) {
        let blogPostBody = blogItem;

        if (!blogPostBody) {
            return null;
        }

        return (
            <div className="blog" key={index}>
                <div>Title: {blogPostBody.title}</div>
                <div>Location: {blogPostBody.location}</div>
                <div>Date: {moment.unix(blogPostBody.date).format("MM/DD/YYYY")}</div>
                {blogPostBody.blogContent.map(this.renderBlogtextItem)}
            </div>
        );
    }

    render(){
        //order blogs by date
        let blogsArr = [...this.props.blogsArr];
        blogsArr.sort((a,b)=>{
            if (a.date < b.date){
                return 1;
            }
            if (a.date > b.date){
                return -1;
            }
            return 0;
        });
        
        return (
            <div>
                {blogsArr.map(this.renderBlog)}
            </div>
        );
    }
}

export default BlogList;