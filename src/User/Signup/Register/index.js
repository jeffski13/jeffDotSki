import React from 'react';
import moment from 'moment';
import { Button, Grid, Row, Col, FormGroup, ControlLabel, FormControl, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import './styles.css';
import Amplify, { Auth } from 'aws-amplify';
import { AUTH_CONFIG } from '../../Auth/aws-auth-config';
import { jeffskiRoutes } from '../../../app';
import { connect } from 'react-redux';

class Register extends React.Component {
    constructor(props) {
        super(props);
        //get start birthdate of 13 years ago
        let startDate = moment().startOf('day');
        startDate.year(startDate.year() - 13);

        this.state = {
            registerNetwork: null,
            registerNetworkMessage: null,
            username: 'userman1',
            password: 'Password$420', //must have one uppercase, on special
            nameFirst: 'Yolo',
            nameLast: 'Brolo',
            dateOfBirth: startDate,
            email: 'jeffskiosu@gmail.com'
        };
    }

    componentDidMount() {
        Amplify.configure(AUTH_CONFIG);
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
                this.setState({
                    registerNetwork: STATUS_SUCCESS
                });
                console.log('jeffski signup .then data: ', data);

                //go to verification page
            })
            .catch(err => {
                let userMessage = err.message;
                if(err.code === 'UsernameExistsException'){
                    userMessage = 'That username is not available. Please try another username.'
                }
                this.setState({
                    registerNetwork: STATUS_FAILURE,
                    registerNetworkMessage: userMessage
                });
                console.log('jeffski signup .catch err: ', err);
            });
            

        });
    }

    onSignupCancelled = () => {
        this.props.history.push(jeffskiRoutes.login);
    }

    render() {
        console.log('rendering register ', this.props.reduxBlogAuth.authState);
        //if we are not logged in go to login
        if (this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.props.history.push(jeffskiRoutes.profile);
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

export default connect(mapStateToProps)(Register);