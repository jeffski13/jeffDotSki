import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

import { validateFormString } from '../formvalidation';
import { getBlogs } from '../aws/blog';
import BlogList from './BlogList';

class ViewBlogs extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleTripInputChange = this.handleTripInputChange.bind(this);
		this.onGetBlogsButtonClicked = this.onGetBlogsButtonClicked.bind(this);

		this.state = {
			trip: 'Germany2020',
			blogData: []
		};
	}

	handleTripInputChange(e) {
		this.setState({ trip: e.target.value });
	}

	//get list of blogs by trip name from server
	onGetBlogsButtonClicked() {
		getBlogs(this.state.trip, (err, data) => {
			if (err) {
				console.log(err);
			}
			this.setState({ blogData: data });
		});
	}

	render() {
		return (
			<div>
				<form>
					<FormGroup
						controlId="formBasicText"
						validationState={validateFormString(this.state.trip)}
					>
						<ControlLabel>Trip</ControlLabel>
						<FormControl
							type="text"
							value={this.state.trip}
							placeholder="Enter text"
							onChange={this.handleTripInputChange}
						/>
						<FormControl.Feedback />
					</FormGroup>
				</form>
				<ButtonToolbar>
					<Button bsStyle="primary" bsSize="large" onClick={this.onGetBlogsButtonClicked}>
						Get Dem Blogs button
          			</Button>
				</ButtonToolbar>

				<div>
					<BlogList blogsArr={this.state.blogData} />
				</div>
			</div>
		);
	}
}

export default ViewBlogs;