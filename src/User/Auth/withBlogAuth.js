import React from 'react';
import { AUTH_CONFIG } from './aws-auth-config';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';
import Amplify, { Auth } from 'aws-amplify';
import aws4 from "aws4";
import { getBlogUserSecure } from '../BlogUser';
import {
    BLOG_USERINFO_CALL_FAIL,
    AUTH_STATE_LOGIN_FAIL_PASSWORD_RESET, AUTH_STATE_LOGIN_LOADING, AUTH_STATE_LOGIN_FAIL_USERNOTVERIFIED, AUTH_STATE_LOGIN_FAIL, AUTH_STATE_LOGGOUT_FAIL,
    AUTH_STATE_LOGGOUT_LOADING,
    AUTH_STATE_VERIFY_FAIL_NOUSERNAME, AUTH_STATE_VERIFYING, AUTH_STATE_VERIFY_FAIL_INVALIDCODE,
    AUTH_STATE_RESENDINGCODE, AUTH_STATE_RESENDCODE_FAIL,
    AWS_CODE_FAILURE_USERNOTVERIFIED, AWS_CODE_FAILURE_PASSWORDRESETREQUIRED
} from './consts';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { storeUserInfo, storeAuthState } from './actions';



/**
 * Gives user access to a prop called "blogAuth" which contains information about the current user and methods for:
 * login(username, password)
 * logout()
 * verifyUserSignup(verifyCode)
 * resendUserSignupEmail()
 * 
 * NOTE: this higher order component is not static, using it in one class with not keep its state in another
 * user state will be kept in redux: authState
 * @param {React Component} OgComponent - component which will be granted the super powers of blog authentication
 */
let withBlogAuth = (OgComponent) => {
    return class extends React.Component {

        componentDidMount() {
            Amplify.configure(AUTH_CONFIG);
        }

        login = async (username, password) => {
            this.props.storeAuthState({
                isLoggedIn: false,
                isLoading: true,
                currentState: AUTH_STATE_LOGIN_LOADING
            });
            this.props.storeUserInfo({
                username: username, //store username, we will need this when we verify with code
                password: password
            });
            const newPassword = '';
            const email = '';
            const phone_number = '';

            try {
                const user = await Auth.signIn(username, password);

                if (user.challengeName === 'SMS_MFA' ||
                    user.challengeName === 'SOFTWARE_TOKEN_MFA') {
                    // You need to get the code from the UI inputs
                    // and then trigger the following function with a button click
                    // const code = getCodeFromUserInput();
                    const code = 'code1234';
                    // If MFA is enabled, sign-in should be confirmed with the confirmation code
                    const loggedUser = await Auth.confirmSignIn(
                        user,   // Return object from Auth.signIn()
                        code,   // Confirmation code  
                        'SMS' // MFA Type e.g. SMS, TOTP.
                    );
                } else if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
                    const { requiredAttributes } = user.challengeParam; // the array of required attributes, e.g ['email', 'phone_number']
                    // You need to get the new password and required attributes from the UI inputs
                    // and then trigger the following function with a button click
                    // For example, the email and phone_number are required attributes
                    // const { username, email, phone_number } = getInfoFromUserInput();
                    const loggedUser = await Auth.completeNewPassword(
                        user,               // the Cognito User Object
                        newPassword,       // the new password
                        // OPTIONAL, the required attributes
                        {
                            email,
                            phone_number
                        }
                    );
                    this.props.storeAuthState({
                        isLoggedIn: false,
                        isLoading: false,
                        currentState: AUTH_STATE_LOGIN_FAIL_PASSWORD_RESET
                    });
                } else if (user.challengeName === 'MFA_SETUP') {
                    // This happens when the MFA method is TOTP
                    // The user needs to setup the TOTP before using it
                    // More info please check the Enabling MFA part
                    Auth.setupTOTP(user);
                } else {
                    //SUCCESSSSSSS!!!! we are logged into AWS
                    //at this point we should be able to get the users AWS and blog info
                    this.getAuthedUserInfo();
                }
            } catch (err) {
                if (err.code === AWS_CODE_FAILURE_USERNOTVERIFIED) {
                    // The error happens if the user didn't finish the confirmation step when signing up
                    // In this case you need to resend the code and confirm the user
                    // About how to resend the code and confirm the user, please check the signUp part
                    this.props.storeAuthState({
                        isLoggedIn: false,
                        isLoading: false,
                        currentState: AUTH_STATE_LOGIN_FAIL_USERNOTVERIFIED
                    });
                } else if (err.code === AWS_CODE_FAILURE_PASSWORDRESETREQUIRED) {
                    // The error happens when the password is reset in the Cognito console
                    // In this case you need to call forgotPassword to reset the password
                    // Please check the Forgot Password part.
                    this.props.storeAuthState({
                        isLoggedIn: false,
                        isLoading: false,
                        currentState: AUTH_STATE_LOGIN_FAIL_PASSWORD_RESET
                    });
                } else {
                    this.props.storeAuthState({
                        isLoggedIn: false,
                        isLoading: false,
                        currentState: AUTH_STATE_LOGIN_FAIL
                    });
                }
            }
        }

        getAuthedUserInfo = () => {
            console.log('wit blogauth getAuthedUserInfo ')
            this.props.storeAuthState({
                isLoading: true,
                currentState: AUTH_STATE_LOGIN_LOADING
            });
            Auth.currentAuthenticatedUser({
                bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
            }).then((awsUser) => {
                console.log('jeffski Current authed user: ', awsUser);
                this.props.storeUserInfo({
                    username: awsUser.username,
                    email: awsUser.attributes.email,
                    id: awsUser.attributes.sub
                });
                this.props.storeAuthState({
                    isLoggedIn: true,
                    isLoading: false,
                    currentState: null,
                    hasDoneInitialAuthCheck: true
                });
            }).catch((err) => {
                // uh oh! shouldnt be here if we are not logged in
                if (err === 'not authenticated') {
                    this.props.storeAuthState({
                        isLoggedIn: false,
                        isLoading: false,
                        currentState: AUTH_STATE_LOGIN_FAIL,
                        hasDoneInitialAuthCheck: true
                    });
                }
            });
        }

        logout = () => {
            this.props.storeAuthState({
                isLoading: true,
                currentState: AUTH_STATE_LOGGOUT_LOADING
            });
            Auth.signOut()
                .then((user) => {
                    //reset login and user states
                    this.props.storeAuthState({
                        isLoggedIn: false,
                        isLoading: false,
                        currentState: null
                    });
                    this.props.storeUserInfo({});

                })
                .catch((err) => {
                    this.props.storeAuthState({
                        isLoggedIn: false,
                        isLoading: false,
                        currentState: AUTH_STATE_LOGGOUT_FAIL
                    });
                });
        }

        verifyUserSignup = (verifyCode) => {

            console.log('jeffski checking user name ', this.state.user.username);
            //we want user to go through login (verify username and password) before we try to confirm signup
            let userName = this.props.reduxBlogAuth.userInfo.username;
            if (!userName || userName === '') {
                this.props.storeAuthState({
                    isLoading: false,
                    currentState: AUTH_STATE_VERIFY_FAIL_NOUSERNAME
                });
            }

            this.props.storeAuthState({
                isLoading: true,
                currentState: AUTH_STATE_VERIFYING
            });
            //start call for verifying user
            Auth.confirmSignUp(userName, verifyCode, {
                // Optional. Force user confirmation irrespective of existing alias. By default set to True.
                forceAliasCreation: true
            }).then((data) => {
                this.props.storeAuthState({
                    isLoading: false,
                    currentState: null
                });
                this.login(userName, this.props.reduxBlogAuth.userInfo.password);
            }).catch((err) => {
                this.props.storeAuthState({
                    isLoading: false,
                    currentState: AUTH_STATE_VERIFY_FAIL_INVALIDCODE
                });
            });
        }

        resendUserSignupEmail = () => {
            //we want user to go through login (verify username and password) before we send email
            let userName = this.props.reduxBlogAuth.userInfo.username;
            if (!userName || userName === '') {
                this.props.storeAuthState({
                    isLoading: false,
                    currentState: AUTH_STATE_VERIFY_FAIL_NOUSERNAME
                });
            }

            this.props.storeAuthState({
                isLoading: true,
                currentState: AUTH_STATE_RESENDINGCODE
            });

            Auth.resendSignUp(userName).then(() => {
                console.log('code resent successfully');
            }).catch(e => {
                this.props.storeAuthState({
                    isLoading: false,
                    currentState: AUTH_STATE_RESENDCODE_FAIL
                });
                console.log(e);
            });
        }


        async authenticatedCall() {
            const apiHost = 'me41kdv4y4.execute-api.us-east-2.amazonaws.com';
            const opts = {
                method: "GET",
                service: "execute-api",
                region: 'us-east-2',
                path: "/latest/require-auth",
                host: apiHost,
                url: `https://${apiHost}/Prod/blogsecure&id=038d18a0-f9dc-11e8-8035-f3d260395f72`
            };
            const credentials = await Auth.getCredentials();
            const { accessKeyId, secretAccessKey, sessionToken } = credentials;
            const request = aws4.sign(opts, {
                accessKeyId,
                secretAccessKey,
                sessionToken
            });
            delete request.headers.Host;
            const response = await fetch(opts.url, {
                headers: request.headers
            });
            if (response.ok) {
                return await response.json();
            } else return { message: response.statusText };
        }

        invokeApi = async call => {
            try {
                const response = await call(Auth);
                console.log('jeffski called api: ', response);
            } catch (err) {
                console.log('jeffski error calling api: ', err.message, err)
            }
        };

        render() {
            let blogAuthProps = {
                ...this.state,
                login: this.login,
                logout: this.logout,
                checkForAuth: this.getAuthedUserInfo,
                verifyUserSignup: this.verifyUserSignup,
                resendUserSignupEmail: this.resendUserSignupEmail
            }

            return (
                <OgComponent
                    {...this.props}
                    blogAuth={blogAuthProps}
                />
            )
        }
    }
};

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ storeUserInfo, storeAuthState }, dispatch);
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withBlogAuth);