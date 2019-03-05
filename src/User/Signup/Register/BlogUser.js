import React from 'react';
import moment from 'moment';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import { jeffskiRoutes } from '../../../app';
import { connect } from 'react-redux';
import withBlogAuth from '../../Auth/withBlogAuth';
import { createBlogUserSecure, getBlogUserSecure } from '../../BlogUser';
import Loadingski from '../../../Inf/Loadingski';
import './styles.css';

class BlogUser extends React.Component {
    constructor(props) {
        super(props);
        //get start birthdate of 13 years ago
        let startDate = moment().startOf('day');
        startDate.year(startDate.year() - 13);
        let minDate = moment().startOf('day');
        minDate.year(minDate.year() - 13);

        this.state = {
            registerNetwork: STATUS_LOADING,
            registerNetworkMessage: null,
            initialBlogUserInfoCheck: false,
            nameFirst: '',
            nameLast: '',
            dateOfBirth: startDate,
            minDateNumber: minDate.unix()
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

        //if we are logged in lets make sure user has not already create blog user data
        this.checkForUserBlogInfo();
    }

    checkForUserBlogInfo = () => {
        //if we have already done the initial check dont call this twice
        if(this.state.initialBlogUserInfoCheck){
            return;
        }

        this.setState({
            registerNetwork: STATUS_LOADING,
            initialBlogUserInfoCheck: true
        }, () => {

            // make sure blog user doesnt already exist
            getBlogUserSecure(this.props.reduxBlogAuth.userInfo.id, (err, blogUserInfo) => {
                if (err) {
                    if (err.status === 404 && err.data.code === 'NotFound') {
                        // if user info does not come back we are in the right: we are logged in but need to create blog user info
                        return this.setState({
                            registerNetwork: null
                        });
                    }

                    //if we get here blog user info call may have completely failed. Should we tell user they are a failure at life?
                    return this.setState({
                        registerNetwork: STATUS_FAILURE
                    });
                }

                //User has already finished signup! let state decide where we go from here
                this.setState({
                    registerNetwork: STATUS_SUCCESS
                });
            });
        });
    }

    componentDidUpdate(previousProps) {
        if(!this.state.initialBlogUserInfoCheck && this.props.reduxBlogAuth.authState.isLoggedIn && this.props.reduxBlogAuth.userInfo.isUserVerified){
            this.checkForUserBlogInfo();
        }

        if(this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck && !this.props.reduxBlogAuth.authState.isLoggedIn){
            this.props.history.push(jeffskiRoutes.login);
        }
    }

    isFormDisabled = () => {
        return (this.state.registerNetwork === STATUS_LOADING) || 
            !this.state.dateOfBirth ||
            (this.state.dateOfBirth.unix() > this.state.minDateNumber) ||
            !this.state.nameFirst || !this.state.nameLast;
    }

    onSignupClicked = () => {
        this.setState({
            registerNetwork: STATUS_LOADING
        }, () => {
            let userSignupInfo = {
                nameFirst: this.state.nameFirst,
                nameLast: this.state.nameLast,
                dateOfBirth: moment(this.state.dateOfBirth.valueOf()).unix(),
                sub: this.props.reduxBlogAuth.userInfo.id,
                email: this.props.reduxBlogAuth.userInfo.email,
                username: this.props.reduxBlogAuth.userInfo.username
            };

            createBlogUserSecure(this.props.reduxBlogAuth.userInfo.id, userSignupInfo, (err, data) => {
                if (err) {
                    return this.setState({
                        registerNetwork: STATUS_FAILURE
                    });
                }

                //WE DID IT! let state decide where we go from here
                this.setState({
                    registerNetwork: STATUS_SUCCESS
                });
            });

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

    render() {
        //loading state
        if (this.state.registerNetwork === STATUS_LOADING) {
            return (<Loadingski />);
        }
        else if (this.state.registerNetwork === STATUS_SUCCESS) {
            //if we are logged in and blog user info already exists go to login
            this.props.history.push(jeffskiRoutes.profile);
        }

        return (
            <div className="Register">
                <Grid>
                    <Row className="show-grid">
                        <Col xs={0} sm={2} md={4} />
                        <Col xs={12} sm={8} md={4}>
                            <h2 className="Register-title">Hello {this.props.reduxBlogAuth.userInfo.username}!</h2>
                            <h4 className="Register-title">Just a couple more things:</h4>
                        </Col>
                        <Col xs={0} sm={2} md={4} />
                    </Row>

                    <form>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="registerEmailInput"
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
                                    controlId="registerNameFirstInput"
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
                                    controlId="registerNameLastInput"
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
                                <div className="form-group">
                                    Date Of Birth: <DatePicker
                                        selected={this.state.dateOfBirth}
                                        onChange={(date) => {
                                            if(date) {
                                                this.setState({ dateOfBirth: date });
                                            }
                                        }}
                                        className="form-control"
                                    />
                                </div>
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
                            <Col xs={10} sm={8} md={4} className="Login_actions">
                                <Button
                                    disabled={this.isFormDisabled()}
                                    bsStyle="primary"
                                    onClick={this.onSignupClicked}
                                >
                                    Finish Signup
                                </Button>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        {this.state.registerNetwork === STATUS_FAILURE &&
                            <Row className="show-grid User_login-message">
                                <Col xs={1} sm={2} md={4} />
                                <Col xs={10} sm={8} md={4}>
                                    <Alert bsStyle="danger">
                                        <strong>Oh No! </strong>{this.state.registerNetworkMessage}
                                    </Alert>
                                </Col>
                                <Col xs={1} sm={2} md={4} />
                            </Row>
                        }
                    </form>
                </Grid>
            </div>
        )
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withBlogAuth(BlogUser));