import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import CircularProgress from 'material-ui/Progress/CircularProgress';

import { validateFormString } from '../formvalidation';
import { getBlogs } from '../aws/blog';
import BlogList from './BlogList';
import Indicator from '../aws/Indicator';

const STATUS_LOADING = 'STATUS_LOADING';
const STATUS_FAILURE = 'STATUS_FAILURE';
const STATUS_SUCCESS = 'STATUS_SUCCESS';

class ViewBlogs extends Component {
	constructor(props, context) {
		super(props, context);

		this.handleTripInputChange = this.handleTripInputChange.bind(this);
		this.onGetBlogsButtonClicked = this.onGetBlogsButtonClicked.bind(this);

		this.state = {
			trip: 'Germany2020',
			blogData: [],
			status: null
		};
	}

	handleTripInputChange(e) {
		this.setState({ trip: e.target.value });
	}

	//get list of blogs by trip name from server
	onGetBlogsButtonClicked() {
		this.setState({ status: STATUS_LOADING });
		getBlogs(this.state.trip, (err, data) => {
			if (err) {
				console.log(err);
				this.setState({ status: STATUS_FAILURE });
				return;
			}
			this.setState({ 
				blogData: data,
				status: STATUS_SUCCESS 
			});
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
					<Button 
						bsStyle="primary" 
						bsSize="large" 
						onClick={this.onGetBlogsButtonClicked}
						disabled={this.state.status === STATUS_LOADING}
					>
						Get Dem Blogs button
          			</Button>
					<div>
						{(this.state.status === STATUS_LOADING)
							&& <CircularProgress />}
						{(this.state.status === STATUS_SUCCESS)
							&& <Indicator success={true} />}
						{(this.state.status === STATUS_FAILURE)
							&& <Indicator success={false} />}
					</div>
				</ButtonToolbar>

				<div>
					<BlogList blogsArr={this.state.blogData} />
				</div>
			</div>
		);
	}
}

export default ViewBlogs;