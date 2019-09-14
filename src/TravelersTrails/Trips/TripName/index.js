import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, Form, FormGroup, FormControl } from 'react-bootstrap';

import withBlogAuth from '../../Auth/withBlogAuth';
import { updateTripSecure, deleteTripSecure } from '../../TripsForUser';
import { getTripSecure } from '../../GETtrip';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../../Network/consts';
import { validateFormString, FORM_SUCCESS } from '../../../formvalidation';


import './styles.css';
import { deleteBlogPic } from '../../BlogForUser';
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

        //login check is complete
        if (!previousProps.reduxBlogAuth.authState.hasDoneInitialAuthCheck && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            this.getTripData();
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
            }, () => {
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

    onDeleteClicked = async () => {
        // fire and forget deletion of all blog images
        await this.props.allBlogs.forEach(nextBlog => {
            deleteBlogPic(nextBlog.titleImageUrl, (err) => {
                if (err) {
                    console.error(`Failed to delete image for blog ${nextBlog.id} with error: ${err}`);
                    return;
                }
                
                console.log(`Success deleteing image for blog ${nextBlog.id}`);
            });
        });

        // make call to delete trip from user
        this.setState({
            editTripNetwork: STATUS_LOADING
        }, () => {
            //let parent component know we are loading
            this.props.editTripNetworkChangeCallback(STATUS_LOADING);

            deleteTripSecure(this.props.reduxBlogAuth.userInfo.id, this.props.tripId, (err, data) => {
                if (err) {
                    console.error('Error whilst deleting trip: ', err);
                    let editTripFormState = this.state.editTripForm;
                    editTripFormState.name.errorMessage = 'An error occured while deleting the trip. Some of your images may have successfully deleted. Please try again later.';

                    return this.setState({
                        editTripNetwork: STATUS_FAILURE,
                        editTripForm: editTripFormState,
                    }, () => {
                        //let parent component know we are a failure at life
                        this.props.editTripNetworkChangeCallback(STATUS_FAILURE, true);
                    });
                }

                this.setState({
                    editTripNetwork: STATUS_SUCCESS,
                    isEditing: false,
                }, () => {
                    //let parent component know we have successfully deleted the trip
                    this.props.editTripNetworkChangeCallback(STATUS_SUCCESS, true);
                    this.props.isEditingTripCallback(false);
                });
            });
        })
    }

    updateTripName = () => {
        this.setState({
            editTripNetwork: STATUS_LOADING
        }, () => {
            //let parent component know we are loading
            this.props.editTripNetworkChangeCallback(STATUS_LOADING, false);

            let tripInfo = {
                name: this.state.editTripForm.name.value
            }
            updateTripSecure(this.props.reduxBlogAuth.userInfo.id, this.props.tripId, tripInfo, (err, data) => {
                if (err) {
                    console.error('Error whilst updating trip: ', err);
                    let editTripFormState = this.state.editTripForm;
                    editTripFormState.name.errorMessage = err.data.message;

                    return this.setState({
                        editTripNetwork: STATUS_FAILURE,
                        editTripForm: editTripFormState,
                    }, () => {
                        //let parent component know we are a failure at life
                        this.props.editTripNetworkChangeCallback(STATUS_FAILURE, false);
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
                    //let parent component know we are straight up bosses
                    this.props.editTripNetworkChangeCallback(STATUS_SUCCESS);
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
                                disabled={this.props.isDisabled}
                                title="Please finish your blog."
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
                    <div>
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

                            <Row className="show-grid">
                                <Col />
                                <Col sm={10} md={8} className="User_actions-section">
                                    <span className="User_action-button" >
                                        <Button
                                            onClick={this.submitEditTripForm}
                                            variant="primary"
                                            size="lg"
                                            disabled={!this.isEditTripFormSubmitAllowed() || this.state.editTripNetwork === STATUS_LOADING}
                                        >
                                            Save
                                        </Button>
                                    </span>
                                    <span className="User_action-button" >
                                        <Button
                                            onClick={() => {
                                                //reset form
                                                this.setState({                                                    
                                                    isEditing: false,
                                                    networkStatus: null,
                                                    editTripNetwork: null,
                                                    editTripForm: initialTripFormState,
                                                })
                                            }}
                                            variant="secondary"
                                            size="lg"
                                        >
                                            Cancel
                                        </Button>
                                    </span>
                                    <span className="User_action-button" >
                                        <Button
                                            onClick={this.onDeleteClicked}
                                            variant="danger"
                                            size="lg"
                                        >
                                            Delete Trip
                                        </Button>
                                    </span>
                                </Col>
                                <Col />
                            </Row>
                        </Form>
                    </div>
                );
            }
        }

    }

}

TripName.defaultProps = {
    isEditingTripCallback: () => { return false; },
    //second param true if deleting trip
    editTripNetworkChangeCallback: (editTripNetwork, wasDeleting) => { return null; }
};

TripName.propTypes = {
    editTripNetworkChangeCallback: PropTypes.func,
    //function called when trip is/isn't being edited
    isEditingTripCallback: PropTypes.func,
    tripOwnerId: PropTypes.string.isRequired,
    tripId: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    allBlogs: PropTypes.array.isRequired
};

export default withBlogAuth(TripName);