import React from 'react';
import moment from 'moment';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';
import './styles.css';
import Amplify, { Auth } from 'aws-amplify';
import { AUTH_CONFIG } from '../Auth/aws-auth-config';

export default class Signup extends React.Component {
    constructor(props) {
        super(props);
        //get start birthdate of 13 years ago
        let startDate = moment().startOf('day');
        startDate.year(startDate.year() - 13);

        this.state = {
            username: 'userman1',
            password: 'password2', //must have one uppercase
            nameFirst: 'firstname1',
            nameLast: 'lastname1',
            dateOfBirth: startDate,
            email: 'jeffskiosu@gmail.com'

        };
    }

    componentDidMount() {
        Amplify.configure(AUTH_CONFIG);
    }

    isFormDisabled = () => {
        return this.props.blogSignup && this.props.blogSignup.authNetwork === STATUS_LOADING;
    }

    onSignupClicked = () => {
        Auth.signUp({
            username: this.state.username,
            password: this.state.password,
            attributes: {
                email: this.state.email
            }
        })
        .then(data => console.log('jeffski signup .then data: ', data))
        .catch(err => console.log('jeffski signup .catch err: ', err));

        // After retrieveing the confirmation code from the user
        // Auth.confirmSignUp(username, code, {
        //     // Optional. Force user confirmation irrespective of existing alias. By default set to True.
        //     forceAliasCreation: true    
        // }).then(data => console.log('jeffski confirm .then data: ', data))
        //   .catch(err => console.log('jeffski confirm .catch err: ', err));

        // Auth.resendSignUp(username).then(() => {
        //     console.log('code resent successfully');
        // }).catch(e => {
        //     console.log(e);
        // });
    }

    onSignupCancelled = () => {
        this.props.history.push('/login');
    }

    render() {
        return (
            <div className="Signup">
                <Grid>
                    <Row className="show-grid">
                        <Col xs={0} sm={2} md={4} />
                        <Col xs={12} sm={8} md={4}>
                            <h2 className="Signup-title">Let's Get Started!</h2>
                        </Col>
                        <Col xs={0} sm={2} md={4} />
                    </Row>

                    <form>

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="signupNameFirstInput"
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
                                    controlId="signupNameLastInput"
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
                                    controlId="signupUsernameInput"
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
                                    controlId="signupPasswordInput"
                                >
                                    <label className="has-float-label">
                                        <FormControl
                                            type="password"
                                            value={this.state.password}
                                            placeholder="Ex: s0m3Th1ngC0mpl1cAt3D"
                                            onChange={(e) => {
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

                        <Row className="show-grid">
                            <Col xs={1} sm={2} md={4} />
                            <Col xs={10} sm={8} md={4}>
                                <FormGroup
                                    controlId="signupEmailInput"
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
                                <div className="form-group">
                                    Date Of Birth: <DatePicker
                                        selected={this.state.dateOfBirth}
                                        onChange={(date) => {
                                            this.setState({ dateOfBirth: date });
                                        }}
                                        className="form-control"
                                        disabled={this.isFormDisabled()}
                                    />
                                </div>
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
                                        Cancel
                                </Button>
                                </span>
                            </Col>
                            <Col xs={1} sm={2} md={4} />
                        </Row>

                        {this.props.blogSignup && this.props.blogSignup.authNetwork === STATUS_FAILURE &&
                            <Row className="show-grid User_login-message">
                                <Col xs={1} sm={2} md={4} />
                                <Col xs={10} sm={8} md={4}>
                                    <Alert bsStyle="danger">
                                        <strong>Oh No!</strong> Your user name or password was incorrect.
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