import React from 'react';
import { InputGroup, Button, Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import withBlogAuth from '../Auth/withBlogAuth';
import { AUTH_STATE_LOGIN_FAIL_USERNOTVERIFIED, AUTH_STATE_LOGIN_FAIL } from '../Auth/consts';
import { jeffskiRoutes } from '../../app';
import './styles.css';
import '../styles.css';

/**
 * login page will validate a username and password entered. 
 * After the first attempt, we will give feedback on the form.
 */
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '', //must have one uppercase, on special
            showLoginErrorMesssage: false,
            usernameValid: false,
            passwordValid: false,
            isValidated: false
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
        if (this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck && this.props.reduxBlogAuth.authState.isLoggedIn) {
            //redirect to profile
            return this.props.history.push(jeffskiRoutes.profile);
        }
    }

    isFormDisabled = () => {
        return this.props.reduxBlogAuth.authState.isLoading;
    }

    isUsernameValid = () => {
        if (this.state.username && typeof this.state.username === 'string' && this.state.username.length >= 1) {
            return true;
        }
        return false;
    }

    isPasswordValid = () => {
        if (this.state.password && typeof this.state.password === 'string' && this.state.password.length >= 8) {
            return true;
        }
        return false;
    }

    isLoginDisabled = () => {
        return this.isLoggingIn() || !this.isUsernameValid() || !this.isPasswordValid();
    }

    isLoggingIn = () => {
        return this.props.reduxBlogAuth.authState.isLoading;
    }

    onLoginFormEnter = (event) => {
        if (event.key === 'Enter') {
            this.onLoginClicked(event);
        }
    }

    onLoginClicked = (event) => {
        // if we have valid usernames and passwords and we are not loading right now, try to login
        event.preventDefault();
        event.stopPropagation();
        if (!this.isLoginDisabled()) {
            this.props.blogAuth.login(this.state.username, this.state.password);
        }
        else {
            //run validation
            this.setState({
                isValidated: true
            });
        }
    }

    onSignupClicked = () => {
        this.props.history.push(jeffskiRoutes.registerCognito);
    }

    componentDidUpdate(previousProps) {
        if (this.props.reduxBlogAuth.authState.isLoggedIn) {
            //if we are logged in go to profile
            return this.props.history.push(jeffskiRoutes.profile);
        }

        if (!this.props.reduxBlogAuth.authState.isLoading && this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_LOGIN_FAIL_USERNOTVERIFIED) {
            //redirect to verification if needed
            return this.props.history.push(jeffskiRoutes.verify);
        }
    }

    //callback page for
    // https://jeffskiblog.auth.us-east-2.amazoncognito.com/login?response_type=token&client_id=ve30037id36g8m4q811kmnqfs&redirect_uri=https://jeff.ski/user
    render() {

        return (
            <Container className="Login">
                <Row className="show-grid">
                    <Col xs={2} md={4} />
                    <Col xs={8} md={4}>
                        <h2 className="User_header-title">Welcome!</h2>
                    </Col>
                    <Col xs={2} md={4} />
                </Row>

                <Form
                    onSubmit={e => this.onLoginClicked(e)}
                >
                    <Row className="show-grid">
                        <Col xs={2} md={4} />
                        <Form.Group as={Col} xs="8" md="4" controlId="usernameFormInput">
                            <InputGroup>
                                <Form.Control className="User_login-form-label"
                                    placeholder="Username"
                                    aria-describedby="inputGroupPrepend"
                                    type="text"
                                    isInvalid={this.state.isValidated && !this.state.usernameValid}
                                    value={this.state.username || ''}
                                    onChange={(e) => {
                                        this.setState({
                                            username: e.target.value
                                        }, () => {
                                            this.setState({
                                                usernameValid: this.isUsernameValid()
                                            });
                                        });
                                    }}
                                    onKeyDown={this.onLoginFormEnter}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Username must not be blank.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Col xs={2} md={4} />
                    </Row>
                    <Row className="show-grid">

                        <Col xs={2} md={4} />
                        <Form.Group as={Col} xs="8" md="4" controlId="passwordFormInput">
                            <InputGroup>
                                <Form.Control
                                    className="User_password-form-label"
                                    isInvalid={this.state.isValidated && !this.state.passwordValid}
                                    placeholder="Password"
                                    aria-describedby="inputGroupPrepend"
                                    type="password"
                                    value={this.state.password || ''}
                                    onChange={(e) => {
                                        this.setState({
                                            password: e.target.value
                                        }, () => {
                                            this.setState({
                                                passwordValid: this.isPasswordValid()
                                            });
                                        });
                                    }}
                                    onKeyDown={this.onLoginFormEnter}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Password must be 8 characters.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Col xs={2} md={4} />
                    </Row>

                    <Row className="show-grid">
                        <Col xs={2} md={4} />
                        <Col xs={8} md={4} className="Login_actions">
                            <span className="Login_action_button" >
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={this.isLoggingIn()}
                                >
                                    Login
                                </Button>
                            </span>
                            <span className="Login_action_button" >
                                <Button
                                    disabled={this.isLoggingIn()}
                                    onClick={this.onSignupClicked}
                                    variant="secondary"
                                >
                                    Sign Up
                                </Button>
                            </span>
                        </Col>
                        <Col xs={2} md={4} />
                    </Row>
                </Form>


                {(this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_LOGIN_FAIL) &&
                    <Row className="show-grid User_login-message">
                        <Col xs={2} md={4} />
                        <Col xs={8} md={4}>
                            <Alert dismissible variant="danger">
                                <Alert.Heading>Oh No!</Alert.Heading>
                                <p>
                                    Your user name or password was incorrect.
                                </p>
                            </Alert>
                        </Col>
                        <Col xs={2} md={4} />
                    </Row>
                }
            </Container>
        )
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Login)));