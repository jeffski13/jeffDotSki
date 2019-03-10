import React from 'react';
import moment from 'moment';
import { Button, Container, Row, Col, FormGroup, FormControl, Alert, Image, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { withRouter, Link } from 'react-router-dom';

import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import { jeffskiRoutes } from '../../../app';
import { connect } from 'react-redux';
import withBlogAuth from '../../Auth/withBlogAuth';
import { updateBlogUserSecure, getBlogUserSecure, emptyProfileUrl, profileGetFailMessage } from '../../BlogUser';
import Loadingski from '../../../Inf/Loadingski';
import { validateFormString, validateFormStringWithCharacterMax, validateFormPositiveAndLessThanOrEqualToMaximum, FORM_ERROR } from '../formvalidation';
import '../../styles.css';
import './styles.css';

const BIO_TEXT_ROWS_DEFAULT = 4;

class ProfileEditInfo extends React.Component {
    constructor(props) {
        super(props);
        //get start birthdate of 13 years ago
        let minDate = moment().startOf('day');
        minDate.year(minDate.year() - 13);

        this.state = {
            profileFetchNetwork: STATUS_LOADING,
            profileFetchNetworkMessage: null,
            profileEditNetwork: null,
            profileEditNetworkMessage: null,
            profileNetworkThrottle: false,
            nameFirst: null,
            nameLast: null,
            dateOfBirth: null,
            minDateNumber: minDate.unix(),
            bio: '',
            profilePicUrl: emptyProfileUrl,
            bioCharacterLimit: 2000,
            bioTextRows: BIO_TEXT_ROWS_DEFAULT
        };
    }

    componentDidMount() {
        if (this.props.reduxBlogAuth.authState.isLoggedIn) {
            return this.getBlogUserProfile();
        }

        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if (!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            //perform initial auth check
            return this.props.blogAuth.checkForAuth();
        }
    }

    componentDidUpdate(previousProps) {
        if (!previousProps.reduxBlogAuth.authState.hasDoneInitialAuthCheck
            && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck
            && this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.getBlogUserProfile();
        }
    }

    getBlogUserProfile = () => {
        this.setState({
            profileFetchNetwork: STATUS_LOADING
        }, () => {
            getBlogUserSecure(this.props.reduxBlogAuth.userInfo.id, (err, blogUserInfo) => {
                if (err) {
                    return this.setState({
                        profileFetchNetwork: STATUS_FAILURE,
                        profileFetchNetworkMessage: profileGetFailMessage
                    });
                }

                this.setState({
                    ...blogUserInfo,
                    name: `${blogUserInfo.nameFirst} ${blogUserInfo.nameLast}`,
                    profileFetchNetwork: STATUS_SUCCESS,
                    dateOfBirth: moment.unix(blogUserInfo.dateOfBirth)
                });
            });
        });
    }

    isFormDisabled = () => {
        return this.state.profileEditNetwork === STATUS_LOADING;
    }

    isFormInvalid = () => {
        return this.state.profileEditNetwork === STATUS_LOADING ||
            validateFormString(this.state.nameFirst) === FORM_ERROR ||
            validateFormString(this.state.nameLast) === FORM_ERROR ||
            validateFormPositiveAndLessThanOrEqualToMaximum(this.state.dateOfBirth.unix(), this.state.minDateNumber) === FORM_ERROR ||
            validateFormStringWithCharacterMax(this.state.bio, this.state.bioCharacterLimit, true) === FORM_ERROR;
    }

    onSaveProfile = () => {
        let updatedUserInfo = {
            nameFirst: this.state.nameFirst,
            nameLast: this.state.nameLast,
            dateOfBirth: moment(this.state.dateOfBirth.valueOf()).unix(),
            bio: this.state.bio
        };

        this.setState({
            profileEditNetwork: STATUS_LOADING
        }, () => {

            updateBlogUserSecure(this.props.reduxBlogAuth.userInfo.id, updatedUserInfo, (err, data) => {
                if (err) {
                    return this.setState({
                        profileEditNetwork: STATUS_FAILURE
                    });
                }

                //WE DID IT! let state decide where we go from here
                this.setState({
                    profileEditNetwork: STATUS_SUCCESS,
                    profileEditNetworkMessage: 'Profile updated successfully',
                    profileNetworkThrottle: true
                });

                setTimeout(() => {
                    this.setState({
                        profileEditNetwork: null,
                        profileEditNetworkMessage: null,
                        profileNetworkThrottle: false
                    });
                }, 3000);
            });

        });
    }

    onCancelProfileChanges = () => {
        //go back to profile
        this.props.history.push(jeffskiRoutes.profile);
    }

    handleBioTextChange = (e) => {
        //resize text area automatically with the amount of rows user entered...its not working ):
        let textArr = this.bioTextArea.value.split(/\r*\n/);
        let rows = BIO_TEXT_ROWS_DEFAULT;
        if (textArr.length >= BIO_TEXT_ROWS_DEFAULT) {
            rows = textArr.length;
        }

        //store the text user entered and 
        this.setState({
            bio: this.bioTextArea.value,
            bioTextRows: rows
        });
    }

    renderBirthDateValidation = () => {
        //we have typed at least one character
        let hintClassName = 'Register_password-invalid';
        if (this.state.dateOfBirth && this.state.dateOfBirth.unix() <= this.state.minDateNumber) {
            hintClassName = 'Register_password-valid';
        }

        return (<li className={hintClassName}>Must be at least 13 years old</li>);
    }

    goToEditProfilePic = () => {
        this.props.history.push(jeffskiRoutes.profileEditPic);
    }

    render() {

        //if we are not logged in go to login
        if (!this.props.reduxBlogAuth.authState.isLoggedIn && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            this.props.history.push(jeffskiRoutes.login);
        }

        //loading state
        if (this.state.profileFetchNetwork === STATUS_LOADING) {
            return (<Loadingski />);
        }
        if (this.state.profileFetchNetworkMessage === profileGetFailMessage) {
            return (
                <div className="ProfileEditInfo">
                    <Container>
                        <Row className="show-grid">
                            <Col xs={0} sm={2} md={4} />
                            <Col xs={12} sm={8} md={4}>
                                <h2 className="User_header-title">Edit Profile</h2>
                            </Col>
                            <Col xs={0} sm={2} md={4} />
                        </Row>
                        <Row className="show-grid User_error-message">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <Alert bsStyle="danger">
                                    <strong>Oh No! </strong>{this.state.profileFetchNetworkMessage}
                                </Alert>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>
                    </Container>
                </div>
            );
        }

        return (
            <div className="ProfileEditInfo">
                <Container>
                    <Row className="show-grid">
                        <Col xs={0} sm={2} md={4} />
                        <Col xs={12} sm={8} md={4}>
                            <h2 className="User_header-title">Edit Profile</h2>
                        </Col>
                        <Col xs={0} sm={2} md={4} />
                    </Row>

                    <Row className="show-grid">
                        <Col xs={0} sm={2} md={5} />
                        <Col xs={12} sm={8} md={2}>
                            <div className="Profile_profilepic ProfileEditInfo_profilepic" onClick={this.goToEditProfilePic}>
                                <Image fluid src={this.state.profilePicUrl} />
                            </div>
                        </Col>
                        <Col xs={0} sm={2} md={5} />
                    </Row>

                    <form>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="profileEditUsernameInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="text"
                                            value={this.props.reduxBlogAuth.userInfo.username}
                                            placeholder="Ex: sumThingFuN55"
                                            disabled={true}
                                            name="text"
                                            className="form-label-group ability-input BulletTextItem_formTextInput"
                                        />
                                        <span>Username</span>
                                    </label>
                                </FormGroup>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="profileEditEmailInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="email"
                                            value={this.props.reduxBlogAuth.userInfo.email}
                                            placeholder="Ex: yolo@swag.net"
                                            disabled={true}
                                            name="text"
                                            className="form-label-group ability-input BulletTextItem_formTextInput"
                                        />
                                        <span>E-Mail</span>
                                    </label>
                                </FormGroup>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="profileEditNameFirstInput"
                                    validationState={validateFormString(this.state.nameFirst)}
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="text"
                                            value={this.state.nameFirst}
                                            placeholder="Ex: Johnny"
                                            onChange={(e) => {
                                                this.setState({
                                                    nameFirst: e.target.value
                                                });
                                            }}
                                            name="text"
                                            className="form-label-group ability-input BulletTextItem_formTextInput"
                                        />
                                        <span>First Name</span>
                                    </label>
                                </FormGroup>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="profileEditNameLastInput"
                                    validationState={validateFormString(this.state.nameLast)}
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="text"
                                            value={this.state.nameLast}
                                            placeholder="Ex: Tsunami"
                                            onChange={(e) => {
                                                this.setState({
                                                    nameLast: e.target.value
                                                });
                                            }}
                                            name="text"
                                            className="form-label-group ability-input BulletTextItem_formTextInput"
                                        />
                                        <span>Last Name</span>
                                    </label>
                                </FormGroup>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="profileEditBioInput"
                                    validationState={validateFormStringWithCharacterMax(this.state.bio, this.state.bioCharacterLimit, true)}
                                >
                                    <Form.Control>Bio ({this.state.bioCharacterLimit} character limit):</Form.Control>
                                    <FormControl
                                        componentClass="textarea"
                                        value={this.state.bio}
                                        placeholder="What is your favorite place you've visited? Where would you like to go next?"
                                        onChange={this.handleBioTextChange}
                                        inputRef={ref => { this.bioTextArea = ref; }}
                                        rows={this.state.bioTextRows}
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="profileEditDateOfBirthInput"
                                    validationState={validateFormPositiveAndLessThanOrEqualToMaximum(this.state.dateOfBirth.unix(), this.state.minDateNumber)}
                                >
                                    <strong>Date Of Birth: </strong><DatePicker
                                        selected={this.state.dateOfBirth}
                                        onChange={(date) => {
                                            if (date) {
                                                this.setState({ dateOfBirth: date });
                                            }
                                        }}
                                        className="form-control"
                                    />
                                </FormGroup>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row>
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <ul className="Register_validation-list">
                                    {this.renderBirthDateValidation()}
                                </ul>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4} className="User_actions-section">
                                <span className="User_action-button" >
                                    <Button
                                        disabled={this.isFormDisabled() || this.isFormInvalid() || this.state.profileNetworkThrottle}
                                        bsStyle="primary"
                                        onClick={this.onSaveProfile}
                                    >
                                        Save
                                    </Button>
                                </span>
                                <span className="User_action-button" >
                                    <Button
                                        disabled={this.isFormDisabled()}
                                        onClick={this.onCancelProfileChanges}
                                    >
                                        Back To Profile
                                    </Button>
                                </span>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        {this.state.profileEditNetwork === STATUS_FAILURE &&
                            <Row className="show-grid User_error-message">
                                <Col xs={1} sm={2} md={4} />
                                <Col xs={10} sm={8} md={4}>
                                    <Alert bsStyle="danger">
                                        <strong>Oh No! </strong>{this.state.profileEditNetworkMessage}
                                    </Alert>
                                </Col>
                                <Col xs={1} sm={2} md={4} />
                            </Row>
                        }

                        {this.state.profileEditNetwork === STATUS_SUCCESS &&
                            <Row className="show-grid User_error-message">
                                <Col xs={1} sm={2} md={4} />
                                <Col xs={10} sm={8} md={4}>
                                    <Alert bsStyle="success">
                                        <strong>YAY! </strong>{this.state.profileEditNetworkMessage}
                                    </Alert>
                                </Col>
                                <Col xs={1} sm={2} md={4} />
                            </Row>
                        }
                    </form>
                </Container>
            </div>
        );
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(ProfileEditInfo)));