import React from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import {Row} from 'react-bootstrap';

import BlogFormSections from './BlogFormSections';
import BlogEntryText from './BlogFormSections/BlogEntryText';
import BulletList from './BlogFormSections/BulletList';
import Quote from './BlogFormSections/Quote';
import './styles.css';

class BlogEntryFormGenerator extends React.Component {

    constructor(props){
        super(props);

        this.createAddBlogSectionButtons = this.createAddBlogSectionButtons.bind(this);
        this.formSectionDeletedCallback = this.formSectionDeletedCallback.bind(this);
        this.storeFormSectionDataCallback = this.storeFormSectionDataCallback.bind(this);
        this.renderBlogSections = this.renderBlogSections.bind(this);
        this.createBlogDataModel = this.createBlogDataModel.bind(this);

        //add to entry boxes with more stuff
        this.state = {
            blogSectionsToolbox : [
                {
                    label: 'Blog Paragraphs',
                    component: BlogEntryText,
                    blogData: null
                },
                {
                    label: 'Bullet List',
                    component: BulletList,
                    blogData: null
                },
                {
                    label: 'Quote',
                    component: Quote,
                    blogData: null
                }
            ],
            blogEntrySections: [
                
            ]
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
    
    //callback for when child form is filled out
    storeFormSectionDataCallback(idx, newBlogData){
        //set state for this object
        let sectionsArrWithData = [...this.state.blogEntrySections];
        sectionsArrWithData[idx].blogData = newBlogData; 
        this.setState({ blogEntrySections: sectionsArrWithData });

        //hand combined state up to parent object
        let blogtextdata = this.createBlogDataModel();
        this.props.getBlogTextData(blogtextdata);
    }

    //returns a model with blog text data (server-ready)
    createBlogDataModel(){
        let blogTextData = [];
        this.state.blogEntrySections.forEach((nextBlogSection) => {
            if(Array.isArray(nextBlogSection.blogData)){
                blogTextData = [...blogTextData, ...nextBlogSection.blogData];
            }
            else{
                blogTextData = [...blogTextData, nextBlogSection.blogData];
            }
        });

        return blogTextData;
    }
    
    //render all blog sections here.
    // all blog sections are kept in state
    renderBlogSections(sectionComponentInfo, index){
        
        //get title and component information
        let SectionComponent = sectionComponentInfo.component;
        return(
            <BlogFormSections
                key={index}
                title={sectionComponentInfo.label}
                deleteCallback={ () => {this.formSectionDeletedCallback(index)} }
            >
                <SectionComponent
                    formDataCallback={(data) => {this.storeFormSectionDataCallback(index, data)}}
                />
            </BlogFormSections>
        );
    }

    //adds a component to the state array. 
    // adds different components to state depending on which button was clicked
    onAddBlogSectionButtonClicked(index){
        let nextBlogSection = Object.assign({}, this.state.blogSectionsToolbox[index]);
        this.setState( {blogEntrySections: [...this.state.blogEntrySections, nextBlogSection]} );
    }

    //shows all the buttons which allow you to add different sections of text
    createAddBlogSectionButtons(buttonInfo, index){
        let addSectionButtonStyle = {
            padding: "5px",
            margin: "5px"
        }
        return (
            <Button
                key={index}
                style={addSectionButtonStyle}
                variant="raised"
                onClick={()=> this.onAddBlogSectionButtonClicked(index)} 
            >
                {buttonInfo.label}
            </Button>
        )
    }
    
    //the user can add fields of different types
    render(){
        console.log('jeffski state', this.state)
        return(
            <div>
                {this.state.blogEntrySections.map(this.renderBlogSections)}
                <div className="addSectionButtonsContainer">
                    {this.state.blogSectionsToolbox.map(this.createAddBlogSectionButtons)}
                </div>
            </div>
        );
    }
}

BlogEntryFormGenerator.propTypes = {
    //callback with data parameter which will execute when blog data has been obtained
    getBlogTextData: PropTypes.func
}

export default BlogEntryFormGenerator;