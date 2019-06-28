import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, FormControl } from 'react-bootstrap';

import withBlogAuth from '../../Auth/withBlogAuth';
import { updateTripSecure } from '../../TripsForUser';
import { getTripSecure } from '../../GETtrip';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../../../Network/consts';
import { validateFormString, FORM_SUCCESS } from '../../../formvalidation';

import './styles.css';
const initialTripFormState = {
    name: {
        value: '',
        isValid: true,
        validationMessage: '',
        errorMessage: ''
    },
    isValidated: false
};
const defaultErrorMessage = 'An error occured. Please try again later.';

/**
 * displays the trip name and some edit controls (if user owns trip)
 */
class TripName extends React.Component {
    constructor(props) {
        super(props);

        this.editNameInputRef = React.createRef();
        this.state = {
            isEditEnabled: false,
            isEditing: false,
            networkStatus: null,
            editTripNetwork: null,
            editTripForm: initialTripFormState,
        };
    }

    componentDidMount() {
        //loading blogs
        this.setState({
            networkStatus: STATUS_LOADING
        });

        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if (!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            //perform initial auth check
            this.props.blogAuth.checkForAuth();
        }
        else {
            this.getTripData();
        }
    }

    componentDidUpdate(previousProps, previousState) {
        if (!previousState.isEditing && this.state.isEditing) {
            this.editNameInputRef.current.focus();
        }
    }

    getTripData = () => {
        let isUserTripOwner = false;
        //if user is logged in and looking at his or her own blogs, show edit links
        if (this.props.reduxBlogAuth.authState.isLoggedIn && (this.props.reduxBlogAuth.userInfo.id === this.props.tripOwnerId || !this.props.tripOwnerId)) {
            isUserTripOwner = true;
        }
        else {
            isUserTripOwner = false;
        }

        this.setState({
            isEditEnabled: isUserTripOwner,
            networkStatus: STATUS_LOADING,
        }, () => {
            getTripSecure(this.props.tripOwnerId, this.props.tripId, (err, data) => {
                if (err) {
                    console.log('trip error returned', err);
                    return this.setState({
                        networkStatus: STATUS_FAILURE,
                        blogsResults: {
                            error: {
                                status: err.status,
                                message: err.data.message,
                                code: err.data.code
                            }
                        }
                    });
                }
                console.log('trip data returned', data);
                let tripFormNameState = initialTripFormState;
                tripFormNameState.name.value = data.name;
                this.setState({
                    tripName: data.name,
                    networkStatus: STATUS_SUCCESS,
                    editTripForm: tripFormNameState
                });
            });

        });
    }

    editTripNameClicked = () => {
        const editTripFormState = initialTripFormState;
        editTripFormState.name.value = this.state.tripName;
        this.setState({
            isEditing: true,
            editTripForm: editTripFormState
        }, () => {
            this.props.isEditingTripCallback(true);
        });
    }

    isValidTripName = (tripNameInQuestion) => {
        return validateFormString(tripNameInQuestion) === FORM_SUCCESS;
    }

    //returns true if the blog is ready to be submitted to the server
    isEditTripFormSubmitAllowed = () => {
        //form should not submit if we are currently uploading anything
        if (this.state.editTripNetwork === STATUS_LOADING) {
            return false;
        }

        if (this.state.editTripForm.name.isValid) {
            return true;
        }

        return false;
    }

    submitEditTripForm = (event) => {
        // if we have valid trip name and we are not loading right now, try to create a new trip
        event.preventDefault();
        event.stopPropagation();

        //if empty, back out of editting mode
        if (this.state.editTripForm.name.value === '') {
            this.setState({
                editTripForm: initialTripFormState,
                isEditing: false
            }, ()=> {
                this.props.isEditingTripCallback(false);
            });
        }

        if (this.isEditTripFormSubmitAllowed()) {
            this.updateTripName();
        }
        this.setState({
            editTripForm: { ...this.state.editTripForm, isValidated: true }
        });
    }

    updateTripName = () => {
        this.setState({
            editTripNetwork: STATUS_LOADING
        }, () => {
            let tripInfo = {
                name: this.state.editTripForm.name.value
            }
            updateTripSecure(this.props.reduxBlogAuth.userInfo.id, this.props.tripId, tripInfo, (err, data) => {
                if (err) {
                    console.log('error is ', err);
                    let editTripFormState = this.state.editTripForm;
                    editTripFormState.name.errorMessage = err.data.message;

                    return this.setState({
                        editTripNetwork: STATUS_FAILURE,
                        editTripForm: editTripFormState,
                    });
                }

                let editTripFormState = this.state.editTripForm;
                editTripFormState.name.value = data.name;

                this.setState({
                    editTripNetwork: STATUS_SUCCESS,
                    editTripForm: editTripFormState,
                    isEditing: false,
                    tripName: data.trip.name,
                }, () => {
                    this.props.isEditingTripCallback(false);
                });
            });
        })
    }

    render() {

        //user does not own trip. Show read only title
        if (!this.state.isEditEnabled) {
            return (
                <div className="blogBrowserTitle">{this.state.tripName}</div>
            );
        }
        //user owns the trip. Show trip edit UI
        else {
            //user is editing trip
            if (!this.state.isEditing) {
                return (
                    <div className="blogBrowserTitle">{this.state.tripName}
                        <span className="Blogs_tripTitleEditButton">
                            <Button
                                onClick={this.editTripNameClicked}
                                variant="secondary"
                            >
                                <i className="material-icons">edit</i>
                            </Button>
                        </span>
                    </div>
                );
            }
            //user is not editing trip
            else {
                let editTripMessage = null;
                if (this.state.editTripNetwork === STATUS_FAILURE) {
                    editTripMessage = (
                        <div className="Profile_trip-section-addTripErrorMesssage">{this.state.editTripForm.name.errorMessage || defaultErrorMessage}</div>
                    );
                }
                return (
                    <Form
                        className="Blogs_trip-title-edit"
                        onSubmit={e => this.submitEditTripForm(e)}
                    >
                        <FormGroup
                            controlId="Blogs_trip-title-edit-input"
                        >
                            <label className="has-float-label">
                                <FormControl
                                    type="text"
                                    value={this.state.editTripForm.name.value || ''}
                                    placeholder="Name Your Adventure"
                                    onChange={(e) => {
                                        let tripUpdateInfo = {
                                            name: {
                                                value: e.target.value,
                                                isValid: this.isValidTripName(e.target.value)
                                            }
                                        };
                                        this.setState({
                                            editTripForm: { ...this.state.editTripForm, ...tripUpdateInfo }
                                        });
                                    }}
                                    isInvalid={this.state.editTripForm.isValidated && !this.state.editTripForm.name.isValid}
                                    onBlur={this.submitEditTripForm}
                                    disabled={this.state.editTripNetwork === STATUS_LOADING}
                                    ref={this.editNameInputRef}
                                />
                                <span>Edit Trip</span>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.editTripForm.name.validationMessage || 'Your trip name must be unique.'}
                                </Form.Control.Feedback>
                            </label>
                        </FormGroup>
                        {editTripMessage}
                    </Form>
                );
            }
        }

    }

}

TripName.defaultProps = {
    isEditingTripCallback: () => { return false; }
};

TripName.propTypes = {
    //function when trip is/isn't being edited
    isEditingTripCallback: PropTypes.func,
    tripOwnerId: PropTypes.string.isRequired,
    tripId: PropTypes.string.isRequired
};

export default withBlogAuth(TripName);