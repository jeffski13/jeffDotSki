import React from 'react';
import { Panel, Glyphicon } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './styles.css';

class BlogFormSection extends React.Component {

    constructor(props){
        super(props);

        this.minusClicked = this.minusClicked.bind(this);
    }

    //make call to parent and inform them that you hath been deleted
    minusClicked(){
        this.props.deleteCallback();
    }

    render() {
        return (
            <Panel>
                <Panel.Heading>
                    {this.props.title}
                    <div className="panel-toggle btn btn-default btn-xs" onClick={this.minusClicked} >
                        <Glyphicon glyph={"minus"} />
                    </div>
                </Panel.Heading>
                <Panel.Body>
                    {this.props.children}
                </Panel.Body>
            </Panel>
        )
    }
}

BlogFormSection.propTypes = {
    title: PropTypes.string,
    deleteCallback: PropTypes.func
};

export default BlogFormSection;