import React from 'react';
import './styles.css';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import withBlogAuth from '../Auth/withBlogAuth';
import {AUTH_STATE_LOGIN_FAIL_USERNOTVERIFIED, AUTH_STATE_LOGIN_FAIL} from '../Auth/consts';
import { jeffskiRoutes } from '../../app';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'userman1',
            password: 'Password$420', //must have one uppercase, on special
            showLoginErrorMesssage: false
        };
    }

    componentDidMount(){
        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if(!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck){
            //perform initial auth check
            return this.props.blogAuth.checkForAuth();
        }
        if(this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck && this.props.reduxBlogAuth.authState.isLoggedIn){
            //redirect to profile
            return this.props.history.push(jeffskiRoutes.profile);
        }
    }

    isFormDisabled = () => {
        return this.props.reduxBlogAuth.authState.isLoading;
    }
    
    isLoginDisabled = () => {
        return this.isLoggingIn()
        || (!this.state.username || this.state.username.length < 8) 
        || (!this.state.password || this.state.password.length < 8);
    }
    
    isLoggingIn = () => {
        return this.props.reduxBlogAuth.authState.isLoading;
    }
    
    onLoginFormEnter = (event) => {
        if(event.key === 'Enter'){
            this.onLoginClicked();
        }
    }

    onLoginClicked = () => {
        // if we have valid usernames and passwords and we are not loading right now, try to login
        if (!this.isLoginDisabled()) {
                this.props.blogAuth.login(this.state.username, this.state.password);
        }
    }

    onSignupClicked = () => {
        this.props.history.push(jeffskiRoutes.register);
    }

    componentDidUpdate(previousProps) {
        if(this.props.reduxBlogAuth.authState.isLoggedIn){
            return this.props.history.push(jeffskiRoutes.profile);
        }

         //if we are logged in go to profile
         if (!this.props.reduxBlogAuth.authState.isLoading && this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_LOGIN_FAIL_USERNOTVERIFIED) {
            //redirect to verification if needed
            return this.props.history.push(jeffskiRoutes.verify);
        }

    }

    //callback page for
    // https://jeffskiblog.auth.us-east-2.amazoncognito.com/login?response_type=token&client_id=ve30037id36g8m4q811kmnqfs&redirect_uri=https://jeff.ski/user
    render() {
        return (
            <div className="Login">
                <Grid>
                    <Row className="show-grid">
                        <Col xs={2} md={4} />
                        <Col xs={8} md={4}>
                            <h2 className="Login_login-title">Welcome!</h2>
                        </Col>
                        <Col xs={2} md={4} />
                    </Row>

                    <form>
                        <Row className="show-grid">

                            <Col xs={2} md={4} />
                            <Col xs={8} md={4}>
                                <FormGroup
                                    controlId="usernameFormInput"
                                >
                                    <ControlLabel className="User_login-form-label">User Name</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={this.state.username || ''}
                                        placeholder="Enter username"
                                        onKeyPress={this.onLoginFormEnter}
                                        onChange={(e) => {
                                            this.setState({
                                                username: e.target.value
                                            });
                                        }}
                                    />
                                    <FormControl.Feedback />
                                </FormGroup>
                            </Col>
                            <Col xs={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={2} md={4} />
                            <Col xs={8} md={4}>
                                <FormGroup
                                    controlId="passwordFormInput"
                                >
                                    <ControlLabel className="User_login-form-label">Password</ControlLabel>
                                    <FormControl
                                        type="password"
                                        value={this.state.password || ''}
                                        onChange={(e) => {
                                            this.setState({
                                                password: e.target.value
                                            });
                                        }}
                                        onKeyPress={this.onLoginFormEnter}
                                    />
                                    <FormControl.Feedback />
                                </FormGroup>
                            </Col>
                            <Col xs={2} md={4} />
                        </Row>
                        <Row className="show-grid">
                            <Col xs={2} md={4} />
                            <Col xs={8} md={4} className="Login_actions">
                                <span className="Login_action_button" >
                                    <Button
                                        disabled={this.isLoginDisabled()}
                                        bsStyle="primary"
                                        onClick={this.onLoginClicked}
                                        >
                                        Login
                                    </Button>
                                </span>
                                <span className="Login_action_button" >
                                    <Button
                                        disabled={this.isLoggingIn()}
                                        onClick={this.onSignupClicked}
                                    >
                                        Sign Up
                                </Button>
                                </span>
                            </Col>
                            <Col xs={2} md={4} />
                        </Row>

                        {(this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_LOGIN_FAIL) &&
                            <Row className="show-grid User_login-message">
                                <Col xs={2} md={4} />
                                <Col xs={8} md={4}>
                                    <Alert bsStyle="danger">
                                        <strong>Oh No!</strong> Your user name or password was incorrect.
                                    </Alert>
                                </Col>
                                <Col xs={2} md={4} />
                            </Row>
                        }
                    </form>
                </Grid>

            </div >
        )
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Login)));