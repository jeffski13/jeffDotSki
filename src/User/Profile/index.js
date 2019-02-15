import React from 'react';
import { Button, Grid, Row, Col, Image } from 'react-bootstrap';
import withBlogAuth from '../Auth/withBlogAuth';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING} from '../../Network/consts';
import { getBlogUserSecure } from '../BlogUser';
import { BLOG_USERINFO_CALL_FAIL} from '../Auth/consts'
import './styles.css';

class Profile extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            blogUserNetwork: STATUS_LOADING
        };
    }

    renderTripLinks = (nextTripInfo) => {
        return (
            <div key={nextTripInfo.id} >
                <Link to={`/${this.props.reduxBlogAuth.userInfo.id}/trips/${nextTripInfo.id}`} >{nextTripInfo.name}</Link>
            </div>
        );
    }

    componentDidMount(){
        console.log('jeffski: Profile component did mount');
        if(this.props.reduxBlogAuth.authState.isLoggedIn){
            console.log('jeffski: Profile get blog info');
            return this.getBlogUserProfile();
        }
        
        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if(!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck){
            console.log('jeffski: Profile initial not done');
            //perform initial auth check
            this.props.blogAuth.checkForAuth();
        }
    }

    componentDidUpdate(previousProps) {
        if(!previousProps.reduxBlogAuth.authState.hasDoneInitialAuthCheck 
            && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck 
            && this.props.reduxBlogAuth.authState.isLoggedIn){
                this.getBlogUserProfile();
        }
    }
    
    getBlogUserProfile = () => {
        this.setState({
            blogUserNetwork: STATUS_LOADING
        }, () => {
            getBlogUserSecure(this.props.reduxBlogAuth.userInfo.id, (err, blogUserInfo) => {
                if (err) {
                    //PANIC! we have a verified aws user, we were not able to get their information back
                    return this.setState({
                        blogUserNetwork: STATUS_FAILURE
                    });
                }
        
                this.setState({
                    ...blogUserInfo,
                    name: `${blogUserInfo.nameFirst} ${blogUserInfo.nameLast}`,
                    blogUserNetwork: STATUS_SUCCESS
                });
            });
        });
    }

    render(){
        //if we are not logged in go to login
        if (!this.props.reduxBlogAuth.authState.isLoggedIn && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            this.props.history.push('/login');
        }
        let userState = {};
        if (this.state.blogUserNetwork === STATUS_LOADING) {
            userState = {
                name: 'Loading...',
                username: 'Loading...',
                email: 'Loading...',
                dateOfBirth: 'Loading...',
                bio: 'Loading...'
            };
        }
        else if (this.state.blogUserNetwork === STATUS_FAILURE) {
            userState = {
                name: 'Fail',
                username: 'Fail',
                email: 'Fail',
                dateOfBirth: 'Fail',
                bio: 'Fail'
            }
        }
        else {
            userState = {
                ...this.state,
                username: this.props.reduxBlogAuth.userInfo.username,
                email: this.props.reduxBlogAuth.userInfo.email
            };
        }
        
        

        return (
            <div className="User">
                <Grid>
                    <Row className="show-grid">
                        <Col xs={12}>
                            <h2 className="Profile_header">{userState.name}</h2>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col xs={8}>
                            <Col xs={12} >
                                <div className="Profile_title">Username</div>
                                <div>{userState.username}</div>
                            </Col>
                            <Col xs={12} >
                                <div className="Profile_title">Email</div>
                                <div>{userState.email}</div>
                            </Col>
                            <Col xs={12} >
                                <div className="Profile_title">Birth Date</div>
                                <div>{userState.dateOfBirth}</div>
                            </Col>
                        </Col>
                        <Col xs={4}>
                            <Image responsive src={userState.profilePicUrl} />
                        </Col>
                    </Row>

                    <Row className="show-grid Profile_bio">
                        <Col xs={8}>
                            <Col xs={12} >
                                <div className="Profile_title">Bio</div>
                                <div>{userState.bio}</div>
                            </Col>
                        </Col>
                        <Col xs={4}>
                            <Col xs={12} >
                                <div className="Profile_title">Trips</div>
                                {userState.trips && userState.trips.map(this.renderTripLinks)}
                            </Col>
                        </Col>
                    </Row>

                    <Row className="show-grid Profile_actions">
                        <Col xs={8} md={8}>
                            <Button
                                bsStyle="danger"
                                onClick={this.props.blogAuth.logout}
                            >
                                Logout
                            </Button>
                        </Col>
                    </Row>

                </Grid>

            </div >
        )
    }
}

function mapStateToProps({ reduxBlogAuth }) {
    return { reduxBlogAuth };
}

export default connect(mapStateToProps)(withRouter(withBlogAuth(Profile))); 