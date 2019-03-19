import React from 'react';
import { Button, Container, Row, Col, Form, InputGroup, Alert } from 'react-bootstrap';
import "react-datepicker/dist/react-datepicker.css";
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import Amplify, { Auth } from 'aws-amplify';
import { bindActionCreators, compose } from 'redux';
import { AUTH_CONFIG } from '../../Auth/aws-auth-config';
import { jeffskiRoutes } from '../../../app';
import { connect } from 'react-redux';
import withBlogAuth from '../../Auth/withBlogAuth';
import { storeUserInfo, storeAuthState } from '../../Auth/actions';
import './styles.css';
import '../../styles.css';

const passwordRules = [
    {
        text: 'At Least 8 Characters',
        code: 'length',
        regex: null
    },
    {
        text: 'One Uppercase Letter',
        code: 'upperalpha',
        regex: new RegExp('[A-Z]')
    },
    {
        text: 'One Lowercase Letter',
        code: 'loweralpha',
        regex: new RegExp('[a-z]')
    },
    {
        text: 'One Number',
        code: 'numeric',
        regex: new RegExp('[0-9]')
    },
    {
        text: 'One Special Character',
        code: 'special',
        regex: null
    }
];

class Account extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            registerNetwork: null,
            registerNetworkMessage: null,
            username: '',
            password: '', //must have one uppercase, on special
            email: '',
            isValidated: false
        };
    }

    componentDidMount() {
        Amplify.configure(AUTH_CONFIG);

        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if (!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            //perform initial auth check
            this.props.blogAuth.checkForAuth();
        }
    }

    isUsernameValid = () => {
        if (this.state.username && typeof this.state.username === 'string' && this.state.username.length >= 1) {
            return true;
        }
        return false;
    }

    isEmailValid = () => {
        if (this.state.email && typeof this.state.email === 'string' && this.state.email.length >= 3 && this.state.email.includes('@')) {
            return true;
        }
        return false;
    }

    isPasswordValid = () => {
        if (this.state.password && typeof this.state.password === 'string') {
            for (let i = 0; i < passwordRules.length; i++) {
                if (!this.isPasswordValidForRule(passwordRules[i])) {
                    console.log('jeffski password invalid')
                    return false;
                }
            }
        }
        else {
            return false;
        }
        console.log('jeffski password valid')
        return true;
    }

    isFormDisabled = () => {
        return this.state.registerNetwork === STATUS_LOADING || !this.isUsernameValid() || !this.isPasswordValid() || !this.isEmailValid();
    }

    onFormEnterKey = (event) => {
        if (event.key === 'Enter') {
            this.onSignupClicked(event);
        }
    }

    onSignupClicked = (event) => {
        // if we have valid usernames and passwords and we are not loading right now, try to login
        event.preventDefault();
        event.stopPropagation();
        if (!this.isFormDisabled()) {
            this.signupUser();
        }
        else {
            //run validation
            this.setState({
                isValidated: true
            });
        }
    }

    signupUser = () => {
        this.setState({
            registerNetwork: STATUS_LOADING
        }, () => {
            //call signup service
            Auth.signUp({
                username: this.state.username,
                password: this.state.password,
                attributes: {
                    email: this.state.email
                }
            })
                .then(data => {
                    //store everything in redux:
                    this.props.storeUserInfo({
                        email: this.state.email,
                        username: this.state.username,
                        isUserVerified: data.userConfirmed,
                        password: this.state.password,
                        id: data.userSub
                    });

                    this.setState({
                        registerNetwork: STATUS_SUCCESS
                    });
                })
                .catch(err => {
                    let userMessage = err.message;
                    // make some pretty messages for the common signup errors
                    if (err.code === 'UsernameExistsException') {
                        userMessage = 'That username is not available. Please try another username.'
                    }
                    this.setState({
                        registerNetwork: STATUS_FAILURE,
                        registerNetworkMessage: userMessage
                    });
                });
        });
    }

    onSignupCancelled = () => {
        this.props.history.push(jeffskiRoutes.login);
    }

    isPasswordValidForRule(rule) {
        if (rule.code === 'length') {
            if (this.state.password.length >= 8) {
                return true;
            }
        }
        else if (rule.code === 'special') {
            const specialChars = ['^', '$', '*', '.', '[', ']', '{', '}', '(', ')', '?', '-', '"', '!', '@', '#', '%', '&', '/', '\\', ',', '>', '<', "'", ':', ';', '|', '_', '~', '`'];
            for (let i = 0; i < specialChars.length; i++) {
                if (this.state.password.includes(specialChars[i])) {
                    return true;
                }
            }
        }
        else {
            let regex = rule.regex;
            if (regex.exec(this.state.password)) {
                return true;
            }
        }
        return false;
    }

    renderPasswordAnalysisList = (nextPasswordRule) => {
        //we have typed at least one character
        let hintClassName = 'Register_password-invalid';
        if (this.isPasswordValidForRule(nextPasswordRule)) {
            hintClassName = 'Register_password-valid';
        }

        return (<li className={hintClassName}>{nextPasswordRule.text}</li>);
    }

    render() {

        //if we are not logged in go to login
        if (this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.props.history.push(jeffskiRoutes.profile);
        }
        if (this.state.registerNetwork === STATUS_SUCCESS) {
            this.props.history.push(jeffskiRoutes.verify);
        }

        return (
            <Container className="Register User">
                <Row className="show-grid">
                    <Col />
                    <Col xs={12} sm={8} md={4}>
                        <h2 className="Register-title">Let's Get Started!</h2>
                    </Col>
                    <Col />
                </Row>

                <Form
                    onSubmit={e => this.onSignupClicked(e)}
                >
                    <Row className="show-grid">
                        <Col />
                        <Form.Group as={Col} xs={10} sm={8} md={6} lg={4} controlId="registerEmailInput">
                            <InputGroup>
                                <Form.Control className="User_login-form-label"
                                    aria-describedby="inputGroupPrepend"
                                    isInvalid={this.state.isValidated && !this.isEmailValid()}
                                    type="email"
                                    value={this.state.email}
                                    placeholder="Ex: yolo@swag.net"
                                    onChange={(e) => {
                                        this.setState({
                                            email: e.target.value
                                        });
                                    }}
                                    name="text"
                                    onKeyDown={this.onFormEnterKey}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Email must not be blank.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Col />
                    </Row>

                    <Row className="show-grid">
                        <Col />
                        <Form.Group as={Col} xs={10} sm={8} md={6} lg={4} controlId="registerUsernameInput">
                            <InputGroup>
                                <Form.Control className="User_login-form-label"
                                    aria-describedby="inputGroupPrepend"
                                    isInvalid={this.state.isValidated && !this.isUsernameValid()}
                                    type="text"
                                    value={this.state.username}
                                    placeholder="Ex: SumthingFun"
                                    onChange={(e) => {
                                        this.setState({
                                            username: e.target.value
                                        });
                                    }}
                                    onKeyDown={this.onFormEnterKey}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Username must not be blank.
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Col />
                    </Row>

                    <Row className="show-grid">

                        <Col />
                        <Form.Group as={Col} xs={10} sm={8} md={6} lg={4} controlId="passwordFormInput">
                            <InputGroup>
                                <Form.Control
                                    className="User_password-form-label"
                                    isInvalid={this.state.isValidated && !this.isPasswordValid()}
                                    aria-describedby="inputGroupPrepend"
                                    type="password"
                                    value={this.state.password || ''}
                                    onChange={(e) => {
                                        console.log('jeffski looking at passowrd: ', e.target.value);
                                        this.setState({
                                            password: e.target.value
                                        });
                                    }}
                                    placeholder="Ex: s0m3Th1ngC0mpl!cAt3D"
                                    onKeyDown={this.onFormEnterKey}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Incorrect password format
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>
                        <Col />
                    </Row>

                    <Row className="show-grid">
                        <Col />
                        <Col xs="auto" >
                            <ul className="Register_validation-list">
                                {passwordRules.map(this.renderPasswordAnalysisList)}
                            </ul>
                        </Col>
                        <Col />
                    </Row>

                    <Row className="show-grid">
                        <Col />
                        <Col sm={10} md={8} className="Login_actions">
                            <span className="Login_action_button" >
                                <Button
                                    disabled={this.state.registerNetwork === STATUS_LOADING}
                                    variant="primary"
                                    onClick={this.onSignupClicked}
                                >
                                    Sign Up
                                    </Button>
                            </span>
                            <span className="Login_action_button" >
                                <Button
                                    disabled={this.state.registerNetwork === STATUS_LOADING}
                                    onClick={this.onSignupCancelled}
                                    variant="secondary"
                                >
                                    Go To Login
                                </Button>
                            </span>
                        </Col>
                        <Col />
                    </Row>

                    {this.state.registerNetwork === STATUS_FAILURE &&
                        <Row className="show-grid User_login-message">
                            <Col />
                            <Col xs={10} sm={8} md={4}>
                                <Alert dismissible variant="danger">
                                    <Alert.Heading>Oh No!</Alert.Heading>
                                    <p>
                                        {this.state.registerNetworkMessage}
                                    </p>
                                </Alert>
                            </Col>
                            <Col />
                        </Row>
                    }
                </Form>
            </Container>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ storeUserInfo }, dispatch);
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps, mapDispatchToProps)(withBlogAuth(Account));