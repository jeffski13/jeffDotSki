import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import { validateFormString } from '../../formvalidation';
/*
A quote for a blog, consists of the quote and the person who said those things
*/
class Quote extends Component {
	constructor(props, context) {
		super(props, context);

		this.state = {
			text: null,
			subtext: null
		};
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

	returnBlogQuoteModel = () => {
		//check for valid quote form
		if (this.state.text === null) {
			this.props.formDataCallback(null);
			return;
		}

		//create model for blog quote
		let quoteDataModel = {
			list: {
				style: 'quote',
				textItems: [
					{
						text: this.state.text,
						subtext: this.state.subtext
					}
				]
			}
		};

		//hand data up to callback
		this.props.formDataCallback(quoteDataModel);
	}

	render() {

		return (
			<form>
				<Col xs={12} >
					<FormGroup
						controlId="formBasicText"
						validationState={validateFormString(this.state.text)}
					>
						<ControlLabel>Text</ControlLabel>
						<FormControl
							type="text"
							value={this.state.text}
							placeholder="Enter text"
							onChange={this.handleTextChange}
							onBlur={this.returnBlogQuoteModel}
						/>
						<FormControl.Feedback />
					</FormGroup>
				</Col>

				<Col xs={8} sm={4} >
					<FormGroup
						controlId="formBasicText"
					>
						<ControlLabel>Author (Optional)</ControlLabel>
						<FormControl
							type="text"
							value={this.state.subtexttitle}
							placeholder="Who said it?"
							onChange={this.handleSubtextChange}
							onBlur={this.returnBlogQuoteModel}
						/>
						<FormControl.Feedback />
					</FormGroup>
				</Col>
				<Col xs={4} sm={8} />
			</form>
		);
	}
}

Quote.propTypes = {
	formDataCallback: PropTypes.func //will be called with null if form data is invalid
}

export default Quote;