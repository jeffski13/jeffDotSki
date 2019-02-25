import React from 'react';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { jeffskiRoutes } from '../../../app';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import { AUTH_STATE_VERIFY_SUCCESS, AUTH_STATE_VERIFY_FAIL_INVALIDCODE, AUTH_STATE_VERIFY_FAIL_CAUSEUNKNOWN } from '../../Auth/consts';
import withBlogAuth from '../../Auth/withBlogAuth';
import './styles.css';

class Verify extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            code: '',
            verifyMessage: null
        }
    }

    componentDidMount(){
        //if we dont have a username we cant verify anything
        if(!this.props.reduxBlogAuth.userInfo || !this.props.reduxBlogAuth.userInfo.username) {
            this.props.history.push(jeffskiRoutes.login);
        }
    }

    isFormDisabled = () => {
        return this.props.blogAuth.authNetwork === STATUS_LOADING
    }

    onVerifyClicked = () => {
        this.props.blogAuth.verifyUserSignup(this.state.code)
    }
    
    onResendCodeClicked = () => {
        this.props.blogAuth.resendUserSignupEmail()
    }

    render() {
        console.log('rendering in verify with :', this.props.reduxBlogAuth);
        //if we login successfully go to profile
        if(this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.props.history.push(jeffskiRoutes.profile);
        }
        
        if(this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_VERIFY_SUCCESS) {
            //if we have a user name and password in memory, use it to login
            if(this.props.reduxBlogAuth.userInfo.username && this.props.reduxBlogAuth.userInfo.password){
                this.props.blogAuth.login(this.props.reduxBlogAuth.userInfo.username, this.props.reduxBlogAuth.userInfo.password)
            }
            //if we dont have a user name and password, go back to the login page and let them do all that stuff again
            else{
                this.props.history.push(jeffskiRoutes.login);
            }
        }

        let verifyMessage = null;
        if(this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_VERIFY_FAIL_INVALIDCODE){
            verifyMessage = 'The code you entered was incorrect. Please check your email for a verification code.';
        }
        if(this.props.reduxBlogAuth.authState.currentState === AUTH_STATE_VERIFY_FAIL_CAUSEUNKNOWN){
            verifyMessage = 'An error occurred during verification.';
        }

        return (
            <div className="Verify">
                <Grid>
                    <Row className="show-grid">
                        <Col xs={0} sm={2} md={4} />
                        <Col xs={12} sm={8} md={4}>
                            <h2 className="Verify-title">Let's Get Started!</h2>
                        </Col>
                        <Col xs={0} sm={2} md={4} />
                    </Row>
                    <Row className="show-grid Verify-message">
                        <Col xs={0} sm={2} md={4} />
                        <Col xs={12} sm={8} md={4}>
                            <div>You should receive an email shortly with a verification code.</div>
                        </Col>
                        <Col xs={0} sm={2} md={4} />
                    </Row>

                    <form>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="verifyCodeInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="number"
                                            value={this.state.code}
                                            placeholder="Ex: 123456"
                                            onChange={(e) => {
                                                this.setState({
                                                    code: e.target.value
                                                });
                                            }}
                                            name="text"
                                            className="form-label-group ability-input BulletTextItem_formTextInput"
                                        />
                                        <span>Verification Code</span>
                                    </label>
                                </FormGroup>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4} className="Login_actions">
                            <span className="Verify_action_button" >
                                    <Button
                                        disabled={this.isFormDisabled() || this.state.code.toString().length < 6}
                                        bsStyle="primary"
                                        onClick={this.onVerifyClicked}
                                        >
                                        Verify
                                    </Button>
                                </span>
                                <span className="Verify_action_button" >
                                    <Button
                                        disabled={this.isFormDisabled()}
                                        onClick={this.onResendCodeClicked}
                                        >
                                        Resend Code
                                </Button>
                                </span>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        {verifyMessage && 
                            <Row className="show-grid User_login-message">
                                <Col xs={1} sm={2} md={4} />
                                <Col xs={10} sm={8} md={4}>
                                    <Alert bsStyle="danger">
                                        <strong>Oh No! We got an error: </strong>{verifyMessage} 
                                    </Alert>
                                </Col>
                                <Col xs={1} sm={2} md={4} />
                            </Row>
                        }
                    </form>
                </Grid>
            </div>
        );
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Verify)));