import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';
import Button from 'material-ui/Button';
import { Glyphicon } from 'react-bootstrap';

import { validateFormString } from '../../../formvalidation';
import './styles.css';

/*
the individual bullet item (for the BulletList)
*/
class BulletListTextItem extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			title: null,
			text: null,
			subtext: null
		};
	}

	handleTitleChange = (e) => {
		if (e.target.value === '') {
			this.setState({ title: null });
		}
		else {
			this.setState({ title: e.target.value });
		}
	}

	handleTextChange = (e) => {
		if (e.target.value === '') {
			this.setState({ text: null });
		}
		else {
			this.setState({ text: e.target.value });
		}
	}

	handleSubtextChange = (e) => {
		if (e.target.value === '') {
			this.setState({ subtext: null });
		}
		else {
			this.setState({ subtext: e.target.value });
		}
	}

	onDeleteBulletButtonClicked = () => {
		this.props.onDeleteBulletCallback();
	}

	//get current information in this component and that info back to callback
	returnBlogBulletListModelData = () => {
		//if title, text, and subtext are all null, form is invalid
		if (!this.state.title && !this.state.text && !this.state.subtext) {
			this.props.onDataUpdatedCallback(null);
			return;
		}

		let blogListTextItemModel = {
			title: this.state.title,
			text: this.state.text,
			subtext: this.state.subtext
		}
		this.props.onDataUpdatedCallback(blogListTextItemModel);
	}

	//true if any field has a value
	isAnyFieldFilled = () => {
		return (this.state.title || this.state.text || this.state.subtext);
	}

	render() {

		let buttonStyles = {
			minWidth: "10px",
		}
		return (
			<form>
				<Col xs={12} sm={4} md={4} lg={4} >
					<FormGroup
						validationState={this.isAnyFieldFilled() ? null : validateFormString(this.state.title)}
						className="formTitleInput"
					>
						<label className="has-float-label">
							<FormControl
								type="text"
								value={this.state.title}
								onChange={this.handleTitleChange}
								onBlur={this.returnBlogBulletListModelData}
								name="title"
								className="form-label-group ability-input"
								placeholder="put title text here..."
							/>
							<span>Title</span>
						</label>
					</FormGroup>
				</Col>
				<Col xs={12} sm={4} md={4} lg={4} >
					<FormGroup
						controlId="formTextInput"
						validationState={this.isAnyFieldFilled() ? null : validateFormString(this.state.text)}
					>
						<label className="has-float-label">
							<FormControl
								type="text"
								value={this.state.text}
								placeholder="Enter text"
								onChange={this.handleTextChange}
								onBlur={this.returnBlogBulletListModelData}
								name="text"
								className="form-label-group ability-input"
							/>
							<span>Text</span>
						</label>
					</FormGroup>
				</Col>
				<Col xs={10} sm={3} >
					<FormGroup
						controlId="formSubtextInput"
						validationState={this.isAnyFieldFilled() ? null : validateFormString(this.state.subtext)}
					>
						<label className="has-float-label">
							<FormControl
								type="text"
								value={this.state.subtexttitle}
								placeholder="Enter subtext"
								onChange={this.handleSubtextChange}
								onBlur={this.returnBlogBulletListModelData}
								name="subtext"
								className="form-label-group ability-input"
							/>
							<span>Subtext</span>
						</label>
					</FormGroup>
				</Col>
				<Col xs={1} className="BulletListItem-deleteButtonContainer" >
					<Button
						onClick={this.onDeleteBulletButtonClicked}
						style={buttonStyles}
						variant="raised"
					>
						<Glyphicon glyph="remove" />
					</Button>
				</Col>

			</form>
		);
	}
}

BulletListTextItem.propTypes = {
	onDataUpdatedCallback: PropTypes.func //called with null as first param if this form is invalid
}

export default BulletListTextItem;