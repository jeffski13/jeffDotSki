import React from 'react';
import { AUTH_CONFIG } from './aws-auth-config';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';
import Amplify, { Auth } from 'aws-amplify';
import aws4 from "aws4";
import { getUserSecure } from '../GETuser';

let withBlogAuth = (OgComponent) => {
    return class extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                debugAuth: {
                    username: ''
                },
                user: {
                    username: null,
                    email: null,
                    nameFirst: null,
                    nameLast: null,
                    dateOfBirth: null,
                    trips: []
                },
                isLoggedIn: false,
                authNetwork: STATUS_LOADING
            }
        }

        componentDidMount() {

            Amplify.configure(AUTH_CONFIG);

            //check if user is logged in
            this.getAuthedUserInfo();
        }

        getAuthedUserInfo = () => {
            this.setState({
                authNetwork: STATUS_LOADING
            }, () => {
                Auth.currentAuthenticatedUser({
                    bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
                }).then((awsUser) => {
                    console.log('jeffski Current authed user: ', awsUser);
                    getUserSecure(awsUser.attributes.sub, (err, blogUserInfo) => {
                        if(err){
                            return;
                            //PANIC!
                        }

                        console.log('jeffski userinfo: ', blogUserInfo);
                        this.setState({
                            debugAuth: {
                                username: awsUser.username,
                                accessTokenJwt: awsUser.signInUserSession.accessToken.jwtToken,
                                idTokenJwt: awsUser.signInUserSession.idToken.jwtToken,
                                email: awsUser.attributes.email,
                                id: awsUser.attributes.sub
                            },
                            user: {  
                                ...blogUserInfo,
                                username: awsUser.username,
                                email: awsUser.attributes.email,
                                id: awsUser.attributes.sub,
                                name: `${blogUserInfo.nameFirst} ${blogUserInfo.nameLast}`
                            },
                            isLoggedIn: true,
                            authNetwork: STATUS_SUCCESS
                        })
                    });

                }).catch((err) => {
                    //if we are not authed we will say we "succeeded" on finding if we were logged in.
                    // all other errors indicate some sort of failure
                    let authStatus = STATUS_FAILURE;
                    if (err === 'not authenticated') {
                        authStatus = STATUS_SUCCESS;
                    }
                    this.setState({
                        isLoggedIn: false,
                        authNetwork: authStatus
                    });
                });

            })
        }

        awsLogin = async (username, password) => {

            const newPassword = '';
            const email = '';
            const phone_number = '';
    
            console.log('jeffski in awsLogin() ');
            try {
                console.log('jeffski calling Auth.signIn(username, password) ');
                const user = await Auth.signIn(username, password);
                console.log('jeffski Auth.signIn complete ');
    
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
                } else if (user.challengeName === 'MFA_SETUP') {
                    // This happens when the MFA method is TOTP
                    // The user needs to setup the TOTP before using it
                    // More info please check the Enabling MFA part
                    Auth.setupTOTP(user);
                } else {
                    //at this point we should be logged in
                    this.getAuthedUserInfo();
                }
            } catch (err) {
                if (err.code === 'UserNotConfirmedException') {
                    console.log('jeffski user not confirmed')
                    // The error happens if the user didn't finish the confirmation step when signing up
                    // In this case you need to resend the code and confirm the user
                    // About how to resend the code and confirm the user, please check the signUp part
                } else if (err.code === 'PasswordResetRequiredException') {
                    console.log('jeffski password must be reset')
                    // The error happens when the password is reset in the Cognito console
                    // In this case you need to call forgotPassword to reset the password
                    // Please check the Forgot Password part.
                } else {
                    this.setState({
                        authNetwork: STATUS_FAILURE
                    });
                    console.log(err);
                }
            }
        }
        
        login = (username, password) => {
            this.setState({
                authNetwork: STATUS_LOADING
            }, () => {
                this.awsLogin(username, password)
            });

        }

        logout = () => {
            this.setState({
            }, () => {
                Auth.signOut()
                    .then((user) => {
                        console.log('jeffski signed user out');
                        this.setState({
                            isLoggedIn: false,
                            authNetwork: STATUS_SUCCESS
                        });

                    })
                    .catch((err) => {
                        console.log('ERROR while logging out');
                        this.setState({
                            authNetwork: STATUS_FAILURE
                        });
                    });
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
                logout: this.logout
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

export default withBlogAuth;