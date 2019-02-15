import React from 'react';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { jeffskiRoutes } from '../../../app';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import { AUTH_CODE_FAILURE_VERIFY_NOUSERNAMEPROVIDED } from '../../Auth/consts';
import withBlogAuth from '../../Auth/withBlogAuth';
import './styles.css';

class Verify extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            code: ''
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

                        {this.props.blogAuth.authNetwork === STATUS_FAILURE &&
                            <Row className="show-grid User_login-message">
                                <Col xs={1} sm={2} md={4} />
                                <Col xs={10} sm={8} md={4}>
                                    <Alert bsStyle="danger">
                                        <strong>Oh No! We got an error: </strong>{this.state.registerNetworkMessage} 
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