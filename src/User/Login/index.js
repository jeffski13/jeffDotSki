import React from 'react';
import './styles.css';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import withBlogAuth from '../Auth/withBlogAuth';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: 'jeffski13',
            password: ''
        };
    }

    isFormDisabled = () => {
        return this.props.blogAuth.authNetwork === STATUS_LOADING;
    }
    
    isLoginDisabled = () => {
        return this.props.blogAuth.authNetwork === STATUS_LOADING 
            || (!this.state.username || this.state.username.length < 8) 
            || (!this.state.password || this.state.password.length < 8);
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
        this.props.history.push('/signup');
    }

    //callback page for
    // https://jeffskiblog.auth.us-east-2.amazoncognito.com/login?response_type=token&client_id=ve30037id36g8m4q811kmnqfs&redirect_uri=https://jeff.ski/user
    render() {
        //if we are logged in go to profile
        if (this.props.blogAuth.authNetwork !== STATUS_LOADING) {
            if (this.props.blogAuth.isLoggedIn) {
                console.log('jeffski login blogauth is in');
                this.props.history.push('/profile');
            }
            else {
                console.log('jeffski login blogauth is out');
            }
        }

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
                                        onClick={this.onSignupClicked}
                                    >
                                        Sign Up
                                </Button>
                                </span>
                            </Col>
                            <Col xs={2} md={4} />
                        </Row>

                        {this.props.blogAuth.authNetwork === STATUS_FAILURE &&
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

export default withRouter(withBlogAuth(Login));