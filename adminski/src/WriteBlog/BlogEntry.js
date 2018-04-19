import React from 'react';
import BlogEntryText from './BlogFormSections/BlogEntryText';
import BulletList from './BlogFormSections/BulletList';
import Quote from './BlogFormSections/Quote';
import Button from 'material-ui/Button';
import {Row} from 'react-bootstrap';
import BlogFormSections from './BlogFormSections';
class BlogEntry extends React.Component {

    constructor(props){
        super(props);

        this.createAddBlogSectionButtons = this.createAddBlogSectionButtons.bind(this);
        this.formSectionDeletedCallback = this.formSectionDeletedCallback.bind(this);
        this.renderBlogSections = this.renderBlogSections.bind(this);

        //add to entry boxes with more stuff
        this.state = {
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
            ],
            blogEntrySections: [
                {
                    label: 'Paragraphs',
                    component: BlogEntryText
                }
            ],
        }
    }
    
    //callback for when form section is deleted
    formSectionDeletedCallback(idx){
        let filteredBlogEntrySectionArr = this.state.blogEntrySections.filter(
            (section, index)=>{
                return index !== idx; //false if we find the index we want to remove
            }
        ) 

        this.setState({ blogEntrySections: filteredBlogEntrySectionArr })
    }
    
    //render all blog sections here.
    // all blog sections are kept in state
    renderBlogSections(sectionComponentInfo, index){
        
        //get title and component information
        let SectionComponent = sectionComponentInfo.component;
        return(
            <BlogFormSections 
                title={sectionComponentInfo.label}
                deleteCallback={ () => {this.formSectionDeletedCallback(index)} }
                >
                <SectionComponent />
            </BlogFormSections>
        );
    }

    //adds a component to the state array. 
    // adds different components to state depending on which button was clicked
    onAddBlogSectionButtonClicked(index){
        let nextBlogSection = this.state.blogSectionsToolbox[index];
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