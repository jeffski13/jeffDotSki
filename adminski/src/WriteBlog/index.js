import React, { Component } from 'react';
import { FormGroup, ControlLabel, FormControl, ButtonToolbar, Button } from 'react-bootstrap';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CircularProgress from 'material-ui/Progress/CircularProgress';
import moment from 'moment';
import _ from 'lodash';

import { validateFormString, validateDate, FORM_SUCCESS } from '../formvalidation';
import BlogEntryFormGenerator from './BlogEntryFormGenerator';
import { awsApiKey } from '../configski';
import './styles.css';
import Indicator from './Indicator';


const STATUS_SUCCESS = 'STATUS_SUCCESS';
const STATUS_FAILURE = 'STATUS_FAILURE';
const STATUS_LOADING = 'STATUS_LOADING';

/*
parent/master class for writing a blog.
contains form elements required for a blog. (see other BlogEntryFormGenerator component for optional blog forms).
in charge of finalizing all information and sending it to the server.
*/
class WriteBlog extends Component {

	constructor(props, context) {
		super(props, context);

		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleLocationChange = this.handleLocationChange.bind(this);
		this.handleTripChange = this.handleTripChange.bind(this);
		this.handleParagraphsChange = this.handleParagraphsChange.bind(this);
		this.handleDateChange = this.handleDateChange.bind(this);
		this.storeBlogTextFromChildForm = this.storeBlogTextFromChildForm.bind(this);
		this.onSendClicked = this.onSendClicked.bind(this);

		this.state = {
			trip: 'TestAdminski',
			location: 'Nerdvana',
			date: moment().startOf('day'),
			title: 'Working on json',
			titleImage: '',
			blogtext: [],
			status: null
		};
	}

	handleDateChange(date) {
		this.setState({ date: date },
			() => {
				console.log('jeffski date', this.state.date);
				console.log('jeffski date valueof', this.state.date.valueOf());
				console.log('jeffski moment to unix', moment(this.state.date.valueOf()).unix());
				let valueToAndFromServer = moment(this.state.date.valueOf()).unix();
				console.log('jeffski moment.unix to format', moment.unix(valueToAndFromServer).format("MM/DD/YYYY"));
			}
		);
	}

	handleTitleChange(e) {
		this.setState({ title: e.target.value });
	}

	handleParagraphsChange(e) {
		this.setState({ paragraphs: e.target.value });
	}

	handleLocationChange(e) {
		this.setState({ location: e.target.value });
	}

	handleTripChange(e) {
		this.setState({ trip: e.target.value });
	}

	handleImgFileChange = (e) => {
		this.setState({ titleImage: e.target.files[0].name });
	}

	onSendClicked() {
		//set state to loading so user cant submit blog twice
		// and loading indicator appears
		this.setState({ status: STATUS_LOADING });

		console.log('jeffski state before send:', this.state);

		//send request with new blog entry
		axios({
			method: 'post',
			url: `https://ctbw9plo6d.execute-api.us-east-2.amazonaws.com/Prod/blogs`,
			headers: { 'x-api-key': awsApiKey },
			data: {
				trip: this.state.trip,
				title: this.state.title,
				location: this.state.location,
				date: moment(this.state.date.valueOf()).unix(),
				blogtext: this.state.blogtext
			},
		})
			.then((response) => {
				//loading done, start success fade in
				this.setState({ status: STATUS_SUCCESS });		
			})
			.catch((error) => {
				//loading done, start failure fade in
				this.setState({ status: STATUS_FAILURE });		
			});
	}

	storeBlogTextFromChildForm(blogTextData) {
		this.setState({ blogtext: blogTextData });
	}

	//returns true if the blog is ready to be submitted to the server
	isFormReady() {
		if (validateFormString(this.state.title) === FORM_SUCCESS  &&
			validateFormString(this.state.trip) === FORM_SUCCESS &&
			validateFormString(this.state.titleImage) === FORM_SUCCESS &&
			validateDate(moment(this.state.date.valueOf()).unix()) === FORM_SUCCESS &&
			validateFormString(this.state.location) === FORM_SUCCESS) {
			return true;
		}
		return false;
	}

	render() {

		console.log('jeffski state', this.state);
		return (
			<div className="WriteBlog">
				{/* minimum information required for blog (trip, title, date, location) */}
				<div className="form-group">
					<DatePicker
						selected={this.state.date}
						onChange={this.handleDateChange}
						className="form-control"
					/>
				</div>
				<form>
					<FormGroup
						controlId="tripFormInput"
						validationState={validateFormString(this.state.trip)}
					>
						<ControlLabel>Trip</ControlLabel>
						<FormControl
							type="text"
							value={this.state.trip}
							placeholder="Enter text"
							onChange={this.handleTripChange}
						/>
						<FormControl.Feedback />
					</FormGroup>
					<FormGroup
						controlId="locationFormInput"
						validationState={validateFormString(this.state.location)}
					>
						<ControlLabel>Location</ControlLabel>
						<FormControl
							type="text"
							value={this.state.location}
							placeholder="Enter text"
							onChange={this.handleLocationChange}
						/>
						<FormControl.Feedback />
					</FormGroup>
					<FormGroup
						controlId="titleFormInput"
						validationState={validateFormString(this.state.title)}
					>
						<ControlLabel>Title</ControlLabel>
						<FormControl
							type="text"
							value={this.state.title}
							placeholder="Enter text"
							onChange={this.handleTitleChange}
						/>
						<FormControl.Feedback />
					</FormGroup>
					<FormGroup
						controlId="imageSelectForm"
						validationState={validateFormString(this.state.titleImage)}
					>
						<ControlLabel>Title Image</ControlLabel>
						<FormControl
							type="file"
							placeholder="Choose Image File"
							onChange={this.handleImgFileChange}
						/>
					</FormGroup>
				</form>

				{/* optional form with blog content (paragraphs, bullet list, etc.) */}
				<BlogEntryFormGenerator
					getBlogTextData={(data) => { this.storeBlogTextFromChildForm(data) }}
				/>

				{/* submit button with network success/failure indicator */}
				<ButtonToolbar>
					<Button
						bsStyle="primary"
						bsSize="large"
						onClick={this.onSendClicked}
						disabled={!this.isFormReady() || this.state.status === STATUS_LOADING}
					>
						Send button
          			</Button>
					<div>
						{this.state.status === STATUS_LOADING && <CircularProgress />}
						{this.state.status === STATUS_SUCCESS && <Indicator success={true} />}
						{this.state.status === STATUS_FAILURE && <Indicator success={false} />}
					</div>
				</ButtonToolbar>
			</div>
		);
	}
}

export default WriteBlog;