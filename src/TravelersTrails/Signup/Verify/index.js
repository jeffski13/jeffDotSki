import React from 'react';
import { Button, Container, Row, Col, Form, InputGroup, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { jeffskiRoutes } from '../../../app';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import { AUTH_STATE_VERIFY_SUCCESS, AUTH_STATE_VERIFY_FAIL_INVALIDCODE, AUTH_STATE_VERIFY_FAIL_CAUSEUNKNOWN, 
    AUTH_STATE_RESENDCODE_SUCCESS, AUTH_STATE_RESENDCODE_FAIL_CAUSEUNKNOWN, AUTH_STATE_RESENDCODE_FAIL_MAX_TRIES } from '../../Auth/consts';
import withBlogAuth from '../../Auth/withBlogAuth';
import './styles.css';
import '../../styles.css';

class Verify extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            code: '',
            verifyMessage: null,
            resendEmailNetworkThrottle: false,
            verifyNetworkThrottle: false,
            isValidated: false
        }
    }

    componentDidMount() {
        //if we dont have a username we cant verify anything
        if (!this.props.reduxBlogAuth.userInfo || !this.props.reduxBlogAuth.userInfo.username) {
            this.props.history.push(jeffskiRoutes.login);
        }
    }

    isCodeValid = () => {
        return (typeof this.state.code === 'string' && this.state.code.length >= 6);
    }

    isVerifyDisabled = () => {
        return !this.isCodeValid() || this.state.verifyNetworkThrottle;
    }

    onFormEnterKey = (event) => {
        if (event.key === 'Enter') {
            this.onVerifyClicked(event);
        }
    }

    onVerifyClicked = (event) => {
        // if we have valid code, try to verify
        event.preventDefault();
        event.stopPropagation();
        if (!this.isVerifyDisabled()) {
            
            this.setState({
                verifyNetworkThrottle: true
            }, () => {
                this.props.blogAuth.verifyUserSignup(this.state.code)
    
                setTimeout(() => {
                    this.setState({
                        verifyNetworkThrottle: false
                    });
                }, 1000);
            });
        }
        else {
            //show form feedback
            this.setState({
                isValidated: true
            });
        }
    }

    onResendCodeClicked = () => {
        //WE DID IT! let state decide where we go from here
        this.setState({
            resendEmailNetworkThrottle: true
        }, () => {
            this.props.blogAuth.resendUserSignupEmail()

            setTimeout(() => {
                this.setState({
                    resendEmailNetworkThrottle: false
                });
            }, 3000);
        });
    }

    onVerifyChanged = (e) => {
        //only allow numerics
        let regex = new RegExp(/^\d+$/);
        if (regex.exec(e.target.value) || e.target.value === '') {
            this.setState({
                code: e.target.value
            });
        }
    }

    render() {
        //if we login successfully go to profile
        if (this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.props.history.push(`${jeffskiRoutes.travelTrailsHome}/${this.props.reduxBlogAuth.userInfo.id}`);
        }

        if (this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_VERIFY_SUCCESS) {
            //if we have a user name and password in memory, use it to login
            if (this.props.reduxBlogAuth.userInfo.username && this.props.reduxBlogAuth.userInfo.password) {
                this.props.blogAuth.login(this.props.reduxBlogAuth.userInfo.username, this.props.reduxBlogAuth.userInfo.password)
            }
            //if we dont have a user name and password, go back to the login page and let them do all that stuff again
            else {
                this.props.history.push(jeffskiRoutes.login);
            }
        }

        let verifyMessage = null;
        if (this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_VERIFY_FAIL_INVALIDCODE) {
            verifyMessage = 'The code you entered was incorrect. Please check your email for a verification code.';
        }
        let resendAlert = null;
        if (this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_RESENDCODE_SUCCESS) {
            resendAlert = (
                <Alert dismissible variant="success">
                    <Alert.Heading>Success!</Alert.Heading>
                    <p>
                        You should see a new verification email in your inbox soon.
                    </p>
                </Alert>);
        }
        else if (this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_RESENDCODE_FAIL_MAX_TRIES) {
            resendAlert = (
                <Alert dismissible variant="danger">
                    <Alert.Heading>Oh no!</Alert.Heading>
                    <p>
                        You have exceeded the maximum number of resends. Please try again later.
                    </p>
                </Alert>);
        }
        else if (this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_RESENDCODE_FAIL_CAUSEUNKNOWN) {
            resendAlert = (
                <Alert dismissible variant="danger">
                    <Alert.Heading>Error!</Alert.Heading>
                    <p>
                        There was a problem emailing your code.
                    </p>
                </Alert>);
        }
        else if (this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_VERIFY_FAIL_CAUSEUNKNOWN) {
            verifyMessage = 'An error occurred during verification.';
        }

        return (
            <Container className="Verify User">
                <Row className="show-grid">
                    <Col />
                    <Col xs={12} sm={8} md={4}>
                        <h2 className="Verify-title">Let's Get Started!</h2>
                    </Col>
                    <Col />
                </Row>
                <Row className="show-grid Verify-message">
                    <Col />
                    <Col xs={10} sm={8} lg={6} xl={4} >
                        <div>You should receive an email shortly with a verification code.</div>
                    </Col>
                    <Col />
                </Row>

                <Form
                    onSubmit={e => this.onVerifyClicked(e)}
                >
                    <Row className="show-grid">
                        <Col />
                        <Form.Group as={Col} xs={10} sm={8} lg={6} xl={4} controlId="verifyCodeInput">
                            <InputGroup>
                                <Form.Control
                                    aria-describedby="inputGroupPrepend"
                                    isInvalid={this.state.isValidated && !this.isCodeValid()}
                                    type="text"
                                    value={this.state.code}
                                    placeholder="Ex: 123456"
                                    onChange={this.onVerifyChanged}
                                    onKeyDown={this.onFormEnterKey}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Code must be at least 6 digits.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Col />
                    </Row>

                    <Row className="show-grid">
                        <Col />
                        <Col xs={10} sm={8} md={6} lg={4} className="Login_actions">
                            <span className="Verify_action_button" >
                                <Button
                                    disabled={this.state.verifyNetworkThrottle || this.props.blogAuth.authNetwork === STATUS_LOADING}
                                    variant="primary"
                                    onClick={this.onVerifyClicked}
                                >
                                    Verify
                                    </Button>
                            </span>
                            <span className="Verify_action_button" >
                                <Button
                                    variant="secondary"
                                    disabled={this.state.resendEmailNetworkThrottle || this.props.blogAuth.authNetwork === STATUS_LOADING}
                                    onClick={this.onResendCodeClicked}
                                >
                                    Resend Code
                                </Button>
                            </span>
                        </Col>
                        <Col />
                    </Row>

                    {verifyMessage &&
                        <Row className="show-grid User_login-message">
                            <Col />
                            <Col xs={10} sm={8} md={4}>
                                <Alert dismissible variant="danger">
                                    <Alert.Heading>Oh No!</Alert.Heading>
                                    <p>
                                        We got an error: {verifyMessage}
                                    </p>
                                </Alert>
                            </Col>
                            <Col />
                        </Row>
                    }

                    {this.state.resendEmailNetworkThrottle &&
                        <Row className="show-grid User_error-message">
                            <Col />
                            <Col xs={10} sm={8} md={4}>
                                {resendAlert}
                            </Col>
                            <Col />
                        </Row>
                    }
                </Form>
            </Container>
        );
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Verify)));