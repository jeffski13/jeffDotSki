import React from 'react';
import BlogEntryText from './BlogSections/BlogEntryText';
import BulletList from './BlogSections/BulletList';
import Quote from './BlogSections/Quote';
import Button from 'material-ui/Button';

class BlogEntry extends React.Component {

    constructor(props){
        super(props);

        this.createAddBlogSectionButtons = this.createAddBlogSectionButtons.bind(this);

        //add to entry boxes with more stuff
        this.state = {
            blogEntrySections: [BlogEntryText],
            blogSectionsToolbox : [
                {
                    label: 'Paragraphs',
                    component: BlogEntryText
                },
                {
                    label: 'Bullet',
                    component: BulletList
                },
                {
                    label: 'Quote',
                    component: Quote
                }
            ]
        }
    }

    //render all blog sections here.
    // all blog sections are kept in state
    renderBlogSections(SectionComponent){
        return(
            <SectionComponent />
        );
    }

    //adds a component to the state array. 
    // adds different components to state depending on which button was clicked
    onAddBlogSectionButtonClicked(index){
        let nextBlogSection = this.state.blogSectionsToolbox[index].component;
        this.setState({blogEntrySections: [...this.state.blogEntrySections, nextBlogSection]},
        ()=>{
            //log state after setState is done
            console.log('jeffski clicked ', index, this.state);
        });
    }

    //shows all the buttons which allow you to add different sections of text
    createAddBlogSectionButtons(buttonInfo, index){
        return (
            <Button key={index} variant="raised" onClick={()=> this.onAddBlogSectionButtonClicked(index)} >{buttonInfo.label}</Button>
        )
    }
    
    //the user can add fields of different types
    render(){

        return(
            <div>
                {this.state.blogEntrySections.map(this.renderBlogSections)}
                {this.state.blogSectionsToolbox.map(this.createAddBlogSectionButtons)}
            </div>
        );
    }
}

export default BlogEntry;