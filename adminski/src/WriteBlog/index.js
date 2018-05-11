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
import AWS from 'aws-sdk';
import { AWS_S3_BUCKET_NAME, AWS_S3_REGION, AWS_IDENTITY_POOL_ID, awsApiKey } from '../configski';
import { uploadPhoto } from '../aws/photo';
import { uploadBlog } from '../aws/blog';
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

		this.storeBlogTextFromChildForm = this.storeBlogTextFromChildForm.bind(this);
		this.onSendClicked = this.onSendClicked.bind(this);

		//initialize the AWS S3 SDK connection object
		AWS.config.update({
			region: AWS_S3_REGION,
			credentials: new AWS.CognitoIdentityCredentials({
				IdentityPoolId: AWS_IDENTITY_POOL_ID
			})
		});
		let s3 = new AWS.S3({ apiVersion: '2006-03-01' });

		this.state = {
			trip: 'TestAdminski',
			location: 'Nerdvana',
			date: moment().startOf('day'),
			title: 'Working on json',
			titleImage: {},
			blogtext: [],
			photoStatus: null,
			blogStatus: null,
			awsS3: s3
		};
	}

	
	//form data binding
	handleDateChange(date) {
		this.setState({ date: date });
	}
	
	handleTitleChange = (e) => {
		this.setState({ title: e.target.value });
	}

	handleParagraphsChange = (e) => {
		this.setState({ paragraphs: e.target.value });
	}

	handleLocationChange = (e) => {
		this.setState({ location: e.target.value });
	}

	handleTripChange = (e) => {
		this.setState({ trip: e.target.value });
	}

	handleImgFileChange = (e) => {
		this.setState({ titleImage: e.target.files[0] });
	}

	//upload photo/blog to server
	onSendClicked() {
		//set state to loading so user cant submit blog twice
		// and loading indicator appears
		this.setState({
			blogStatus: STATUS_LOADING,
			photoStatus: STATUS_LOADING
		});

		//upload photo first, then include photo location when uploading blog 
		uploadPhoto(this.state.titleImage, this.state.trip, this.state.awsS3, (err, data) => {
			////////////////////////////////
			//upload photo call complete
			////////////////////////////////
			//error handling
			if (err) {
				this.setState({ photoStatus: STATUS_FAILURE });
				return;
			}
			this.setState({photoStatus: STATUS_SUCCESS});
			
			//send request with new blog entry
			let blogdata = {
				trip: this.state.trip,
				title: this.state.title,
				location: this.state.location,
				date: moment(this.state.date.valueOf()).unix(),
				blogtext: this.state.blogtext,
				titleImage: data.Location
			}
			
			uploadBlog(blogdata, (err, data) => {
				////////////////////////////////
				//upload blog call complete
				////////////////////////////////
				if(err){
					this.setState({ blogStatus: STATUS_FAILURE });
				}
				this.setState({ blogStatus: STATUS_SUCCESS });
			});
		});
	}

	storeBlogTextFromChildForm(blogTextData) {
		this.setState({ blogtext: blogTextData });
	}

	//returns true if the blog is ready to be submitted to the server
	isFormSubmitAllowed() {
		//form should not submit if we are currently uploading anything
		if(this.state.blogStatus === STATUS_LOADING || this.state.photoStatus === STATUS_LOADING){
			return false;
		}

		if (validateFormString(this.state.title) === FORM_SUCCESS &&
			validateFormString(this.state.trip) === FORM_SUCCESS &&
			validateFormString(this.state.titleImage.name) === FORM_SUCCESS &&
			validateDate(moment(this.state.date.valueOf()).unix()) === FORM_SUCCESS &&
			validateFormString(this.state.location) === FORM_SUCCESS) {
			return true;
		}
		return false;
	}

	render() {

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
						validationState={validateFormString(this.state.titleImage.name)}
					>
						<ControlLabel>Title Image</ControlLabel>
						<FormControl
							type="file"
							placeholder="Choose Image File"
							onChange={this.handleImgFileChange}
						/>
					</FormGroup>
				</form>

				{/*form where you can dynamically create blog content (paragraphs, bullet list, etc.) */}
				<BlogEntryFormGenerator
					getBlogTextData={(data) => { this.storeBlogTextFromChildForm(data) }}
				/>

				{/* submit button with network status indicators */}
				<ButtonToolbar>
					<Button
						bsStyle="primary"
						bsSize="large"
						onClick={this.onSendClicked}
						disabled={!this.isFormSubmitAllowed()}
					>
						Send button
          			</Button>
					<div>
						{(this.state.blogStatus === STATUS_LOADING || this.state.photoStatus === STATUS_LOADING)
							&& <CircularProgress />}
						{(this.state.blogStatus === STATUS_SUCCESS && this.state.photoStatus === STATUS_SUCCESS)
							&& <Indicator success={true} />}
						{(this.state.blogStatus === STATUS_FAILURE || this.state.photoStatus === STATUS_FAILURE)
							&& <Indicator success={false} />}
					</div>
				</ButtonToolbar>
			</div>
		);
	}
}

export default WriteBlog;