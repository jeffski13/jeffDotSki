import React from 'react';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
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
            passwordAnalyzerResults: null
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

    isFormDisabled = () => {
        return this.state.registerNetwork === STATUS_LOADING;
    }

    onSignupClicked = () => {
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

    renderPasswordAnalysisList = (nextPasswordRule) => {
        //we have typed at least one character
        let hintClassName = 'Register_password-invalid';
        if (nextPasswordRule.code === 'length') {
            if (this.state.password.length >= 8) {
                hintClassName = 'Register_password-valid';
            }
        }
        else if (nextPasswordRule.code === 'special') {
            const specialChars = ['^', '$', '*', '.', '[', ']', '{', '}', '(', ')', '?', '-', '"', '!', '@', '#','%', '&', '/', '\\', ',', '>', '<', "'", ':', ';', '|', '_', '~', '`'];
            specialChars.forEach((nextChar)=>{
                if (this.state.password.includes(nextChar)) {
                    hintClassName = 'Register_password-valid';
                }
            });
        }
        else {
            let regex = nextPasswordRule.regex;
            if (regex.exec(this.state.password)) {
                hintClassName = 'Register_password-valid';
            }
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
            <div className="Register">
                <Grid>
                    <Row className="show-grid">
                        <Col xs={0} sm={2} md={4} />
                        <Col xs={12} sm={8} md={4}>
                            <h2 className="Register-title">Let's Get Started!</h2>
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
                                            value={this.state.email}
                                            placeholder="Ex: yolo@swag.net"
                                            onChange={(e) => {
                                                this.setState({
                                                    email: e.target.value
                                                });
                                            }}
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
                                    controlId="registerUsernameInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="text"
                                            value={this.state.username}
                                            placeholder="Ex: SumthingFun"
                                            onChange={(e) => {
                                                this.setState({
                                                    username: e.target.value
                                                });
                                            }}
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
                                    controlId="registerPasswordInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="password"
                                            value={this.state.password}
                                            placeholder="Ex: s0m3Th1ngC0mpl1cAt3D"
                                            onChange={(e) => {


                                                console.log('jeffski looking at passowrd: ', e.target.value);
                                                this.setState({
                                                    password: e.target.value
                                                });
                                            }}
                                            name="text"
                                            className="form-label-group ability-input BulletTextItem_formTextInput"
                                        />
                                        <span>Password</span>
                                    </label>
                                </FormGroup>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row>
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <ul className="Register_validation-list">
                                    {passwordRules.map(this.renderPasswordAnalysisList)}
                                </ul>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4} className="Login_actions">
                                <span className="Login_action_button" >
                                    <Button
                                        disabled={this.isFormDisabled()}
                                        bsStyle="primary"
                                        onClick={this.onSignupClicked}
                                    >
                                        Sign Up
                                    </Button>
                                </span>
                                <span className="Login_action_button" >
                                    <Button
                                        onClick={this.onSignupCancelled}
                                    >
                                        Go To Login
                                </Button>
                                </span>
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ storeUserInfo }, dispatch);
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps, mapDispatchToProps)(withBlogAuth(Account));