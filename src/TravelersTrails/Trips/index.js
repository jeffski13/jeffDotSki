import React from 'react';
import { ButtonToolbar, Button, Container, Form, Row, Col, FormGroup, FormControl } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import withBlogAuth from '../Auth/withBlogAuth';
import Indicator from '../../Network/Indicator';
import Loadingski from '../../Inf/Loadingski';
import { validateFormString, validateFormPositiveNumber, FORM_SUCCESS } from '../formvalidation';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';
import { createTripSecure, updateTripSecure } from '../TripsForUser';
import TripsDropdown from './TripsDropdown';
import TripForm from './TripForm';
import { jeffskiRoutes } from '../../app';
import './styles.css';

const TRIP_MODE_CREATE_NEW = 'TRIP_MODE_CREATE_NEW';
const TRIP_MODE_EDIT_EXISTING = 'TRIP_MODE_EDIT_EXISTING';
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

class Trips extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isValidated: false,
            submitTripStatus: null,
            tripMode: TRIP_MODE_CREATE_NEW,
            createTripResults: {
                status: null,
                message: null,
                code: null
            },
            tripInfo: {
                location: {
                    value: '',
                    valid: false
                },
                name: {
                    value: '',
                    valid: false
                },
                country: {
                    value: '',
                },
                state: {
                    value: '',
                },
                year: {
                    value: 0,
                    isValid: false
                },
                month: moment().month() + 1
            },
            refreshTrips: false //toggled whenever we want to refresh trips
        };
    }

    componentDidMount() {

        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if (!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            //perform initial auth check
            return this.props.blogAuth.checkForAuth();
        }

        //if we have done the initial check and we are not logged in go to login
        if (!this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.props.history.push(jeffskiRoutes.login);
        }
    }

    //returns true if the blog is ready to be submitted to the server
    isFormSubmitAllowed() {
        //form should not submit if we are currently uploading anything
        if (this.state.submitTripStatus === STATUS_LOADING) {
            return false;
        }

        if (this.state.tripInfo.location.isValid &&
            this.state.tripInfo.name.isValid &&
            this.state.tripInfo.year.isValid &&
            validateFormPositiveNumber(this.state.tripInfo.month) === FORM_SUCCESS) {
            return true;
        }
        return false;
    }

    onSubmitClicked = (event) => {
        console.log('trip submit');
        // if we have valid usernames and passwords and we are not loading right now, try to login
        event.preventDefault();
        event.stopPropagation();
        if (this.isFormSubmitAllowed()) {
            this.submitTrip();
        }
        else {
            //run validation
            this.setState({
                isValidated: true
            });
        }
    }

    submitTrip = () => {
        //set state to loading so user cant submit blog twice
        // and loading indicator appears
        this.setState({
            submitTripStatus: STATUS_LOADING,
            createTripResults: {}
        }, () => {

            let tripFunctionCallback = (err, data) => {
                if (err) {
                    this.setState({
                        submitTripStatus: STATUS_FAILURE,
                        createTripResults: {
                            status: err.status,
                            message: err.data.message,
                            code: err.data.code
                        }
                    });
                    return;
                }
                //declare victory! and clear out trip creation stuff
                //refresh trips
                this.resetTripForm();
                this.setState({
                    submitTripStatus: STATUS_SUCCESS,
                    createTripResults: {
                        message: 'Trip Submitted!'
                    }
                });
            }


            //send request with new blog entry
            if (this.state.tripMode === TRIP_MODE_CREATE_NEW) {
                createTripSecure(this.props.reduxBlogAuth.userInfo.id, this.state.tripInfo, tripFunctionCallback);
            }
            else if (this.state.tripMode === TRIP_MODE_EDIT_EXISTING) {
                updateTripSecure(this.props.reduxBlogAuth.userInfo.id, this.state.tripId, this.state.tripInfo, tripFunctionCallback);
            }
        });
    }

    resetTripForm = () => {
        this.setState({
            tripMode: TRIP_MODE_CREATE_NEW,
            tripInfo: {
                location: '',
                name: '',
                country: '',
                state: '',
                year: moment().year(),
                month: moment().month() + 1
            },
            refreshTrips: !this.state.refreshTrips
        });
    }

    renderMonthsOptions = (nextMonthName, index) => {
        return (
            <option
                key={nextMonthName + index}
                onSelect={() => {
                    //tell parent we have a new month selected
                    this.tripFormUpdate({ month: index + 1 });
                }}
            >
                {nextMonthName}
            </option>
        );
    }

    render() {

        if (!this.props.reduxBlogAuth.authState.isLoggedIn) {
            return <Loadingski />
        }

        let getTripDetailsContent = null;
        if (this.state.tripInfo) {
            getTripDetailsContent = (
                <div className="tripInformation" >
                    <h3>Trip Information</h3>
                    <div><strong>Name: </strong>{this.state.tripInfo.name.value}</div>
                    <div><strong>Location: </strong>{this.state.tripInfo.location.value}</div>
                    <div><strong>Year: </strong>{this.state.tripInfo.year.value}</div>
                    <div><strong>Month: </strong>{this.state.tripInfo.month}</div>
                </div>
            );
        }

        let tripCreationServerMessage = null;
        if (this.state.createTripResults && this.state.createTripResults.message) {
            tripCreationServerMessage = (
                <div className="tripServerResults" >
                    <h4>Trip Submission Results</h4>
                    <div className="tripServerResultsText" >
                        <div><strong>Message: </strong>{this.state.createTripResults.message}</div>
                        {this.state.createTripResults.code && <div><strong>Code: </strong>{this.state.createTripResults.code}</div>}
                        {this.state.createTripResults.status && <div><strong>Status: </strong>{this.state.createTripResults.status}</div>}
                    </div>
                </div>
            );
        }

        let currentActionMessage = 'Create A New Trip';
        if (this.state.tripMode === TRIP_MODE_EDIT_EXISTING) {
            currentActionMessage = `Editing Trip "${this.state.tripInfo.name}"`;
        }
        return (

            <Container className="Trips">
                <Form
                    onSubmit={e => this.onSubmitClicked(e)}
                >
                    <Button
                        disabled={this.state.tripMode === TRIP_MODE_CREATE_NEW}
                        className="Trips_tripButton"
                        variant="success"
                        onClick={this.resetTripForm}
                    >
                        New Trip
                    </Button>
                    <TripsDropdown
                        className="Trips_tripButton"
                        refreshProp={this.state.refreshTrips}
                        onTripReturned={(tripInfoReturned) => {
                            this.setState({
                                tripMode: TRIP_MODE_EDIT_EXISTING,
                                tripInfo: tripInfoReturned
                            });
                        }}
                        ref={instance => { this.childTripsDropdown = instance; }}
                    />

                    <div className="Trips_tripForm">
                        <h3>{currentActionMessage}</h3>

                        <Row className="show-grid">
                            <Col xs={12} md={8}>
                                <FormGroup
                                    controlId="nameFormInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="text"
                                            value={this.state.tripInfo.name.value || ''}
                                            placeholder="Enter text"
                                            onChange={(e) => {
                                                let tripUpdateInfo = {
                                                    name: {
                                                        value: e.target.value,
                                                        isValid: validateFormString(e.target.value) === FORM_SUCCESS
                                                    }
                                                };
                                                this.setState({
                                                    tripInfo: { ...this.state.tripInfo, ...tripUpdateInfo }
                                                });
                                            }}
                                            isInvalid={this.state.isValidated && !this.state.tripInfo.name.isValid}
                                        />
                                        <span>Name</span>
                                        <Form.Control.Feedback type="invalid">
                                            Name must have a value.
                                        </Form.Control.Feedback>
                                    </label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row className="show-grid">
                            <Col xs={12} md={8}>
                                <FormGroup
                                    controlId="locationFormInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="text"
                                            value={this.state.tripInfo.location.value || ''}
                                            placeholder="Enter text"
                                            onChange={(e) => {
                                                let tripUpdateInfo = {
                                                    location: {
                                                        value: e.target.value,
                                                        isValid: validateFormString(e.target.value) === FORM_SUCCESS
                                                    }
                                                };
                                                this.setState({
                                                    tripInfo: { ...this.state.tripInfo, ...tripUpdateInfo }
                                                });
                                            }}
                                            isInvalid={this.state.isValidated && !this.state.tripInfo.name.isValid}
                                        />
                                        <span>Location</span>
                                        <Form.Control.Feedback type="invalid">
                                            Location must have a value.
                                        </Form.Control.Feedback>
                                    </label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row className="show-grid">
                            <Col xs={12} md={4}>
                                <FormGroup
                                    controlId="yearFormInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            placeholder="Enter text"
                                            type="text"
                                            value={this.state.tripInfo.year.value || ''}
                                            onChange={(e) => {
                                                let tripUpdateInfo = {
                                                    year: {
                                                        value: e.target.value,
                                                        isValid: validateFormPositiveNumber(e.target.value) === FORM_SUCCESS
                                                    }
                                                };
                                                this.setState({
                                                    tripInfo: { ...this.state.tripInfo, ...tripUpdateInfo }
                                                });
                                            }}
                                            isInvalid={this.state.isValidated && !this.state.tripInfo.year.isValid}
                                        />
                                        <span>Year</span>
                                        <Form.Control.Feedback type="invalid">
                                            Year must be a valid number.
                                        </Form.Control.Feedback>
                                    </label>
                                </FormGroup>
                            </Col>
                            <Col xs={12} md={4}>
                                <Form.Group controlId="TripForm_monthFormGroup"
                                    validationState={validateFormPositiveNumber(this.props.month)}
                                >
                                    <Form.Control as="select">
                                        {MONTHS.map(this.renderMonthsOptions)}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className="show-grid">
                            <Col xs={12} md={4}>
                                <FormGroup
                                    controlId="countryFormInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="text"
                                            value={this.state.tripInfo.country.value || ''}
                                            placeholder="Country"
                                            onChange={(e) => {
                                                let tripUpdateInfo = {
                                                    country: {
                                                        value: e.target.value,
                                                    }
                                                };
                                                this.setState({
                                                    tripInfo: { ...this.state.tripInfo, ...tripUpdateInfo }
                                                });
                                            }}
                                        />
                                        <span>Country</span>
                                    </label>
                                </FormGroup>
                            </Col>
                            <Col xs={12} md={4}>
                                <FormGroup
                                    controlId="stateFormInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="text"
                                            value={this.state.tripInfo.state.value || ''}
                                            placeholder="Enter text"
                                            onChange={(e) => {
                                                let tripUpdateInfo = {
                                                    state: {
                                                        value: e.target.value,
                                                    }
                                                };
                                                this.setState({
                                                    tripInfo: { ...this.state.tripInfo, ...tripUpdateInfo }
                                                });
                                            }}
                                        />
                                        <span>State/Province</span>
                                    </label>
                                </FormGroup>
                            </Col>
                        </Row>

                        <ButtonToolbar>
                            <Button
                                variant="primary"
                                size="large"
                                type="submit"
                                disabled={this.state.submitTripStatus === STATUS_LOADING}
                            >
                                Submit
                            </Button>
                            <div>
                                {(this.state.submitTripStatus === STATUS_LOADING)
                                    && <CircularProgress />}
                                {(this.state.submitTripStatus === STATUS_SUCCESS)
                                    && <Indicator success={true} />}
                                {(this.state.submitTripStatus === STATUS_FAILURE)
                                    && <Indicator success={false} />}
                            </div>
                        </ButtonToolbar>
                        {tripCreationServerMessage}
                    </div>
                </Form>
            </Container >
        );
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Trips)));