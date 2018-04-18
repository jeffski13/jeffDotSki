import React from 'react';
import BlogEntryText from './BlogEntryText';
import Button from 'material-ui/Button';

class BlogEntry extends React.Component {

    constructor(props){
        super(props);

        this.addClicked = this.addClicked.bind(this);

        //add to entry boxes with more stuff
        this.state = {
            isAddDialogueShowing: false,
            blogEntryBoxes: ['textonly']
        }
    }

    addClicked(){
        this.setState({isAddDialogueShowing: true});
    }

    //render all entry fields here.
    //we start with one text entry field.
    renderBlogTextEntryAreas(){
        return(
            <div>
                <BlogEntryText />             
            </div>
        );
    }
    
    //the user can add fields of different types
    render(){
        return(
            <div>
                {this.renderBlogTextEntryAreas()}
                {!this.state.isAddDialogueShowing && <button onClick={this.addClicked} >add</button>}
                {this.state.isAddDialogueShowing &&
                    <div>
                        <Button variant="raised" >Paragraphs</Button>
                        <Button variant="raised" >Bullet</Button>
                        <Button variant="raised" >Quote</Button>
                    </div> 
                }
            </div>
        );
    }
}

export default BlogEntry;