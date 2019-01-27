import React from 'react';
import { Button, Grid, Row, Col, Image } from 'react-bootstrap';
import withBlogAuth from '../Auth/withBlogAuth';
import { withRouter, Link } from 'react-router-dom';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../Network/consts';
import './styles.css';
class Profile extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            username: '',
            name: '',
            email: ''
        }
    }

    renderTripLinks = (nextTripInfo) => {
        return (
            <div>
                <Link to={`/${this.props.blogAuth.user.id}/trips/${nextTripInfo.id}`}>{nextTripInfo.name}</Link>
            </div>
        );
    }

    render() {
        //if we are logged in go to profile
        if(this.props.blogAuth.authNetwork !== STATUS_LOADING){
            if(this.props.blogAuth.isLoggedIn){
                console.log('jeffski profile blogauth is in', this.props.blogAuth.debugAuth);
            }
            else{
                console.log('jeffski profile blogauth is out');
                this.props.history.push('/login');
            }
        }

        console.log('jeffski blogauth: ', this.props.blogAuth);
        return (
            <div className="User">
                <Grid>
                    <Row className="show-grid">
                        <Col xs={12}>
                            <h2 className="Profile_header">{this.props.blogAuth.user.name || 'Loading'}</h2>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col xs={8}>
                            <Col xs={12} >
                                <div className="Profile_title">Username</div>
                                <div>{this.props.blogAuth.user.username || 'Loading'}</div>
                            </Col>
                            <Col xs={12} >
                                <div className="Profile_title">Email</div>
                                <div>{this.props.blogAuth.user.email || 'Loading'}</div>
                            </Col>
                            <Col xs={12} >
                                <div className="Profile_title">Birth Date</div>
                                <div>{this.props.blogAuth.user.dateOfBirth || 'Loading'}</div>
                            </Col>
                        </Col>
                        <Col xs={4}>
                            <Image responsive src={this.props.blogAuth.user.profilePicUrl} />
                        </Col>
                    </Row>
                    
                    <Row className="show-grid Profile_bio">
                        <Col xs={8}>
                            <Col xs={12} >
                                <div className="Profile_title">Bio</div>
                                <div>{this.props.blogAuth.user.bio || 'Loading'}</div>
                            </Col>
                        </Col>
                        <Col xs={4}>
                            <Col xs={12} >
                                <div className="Profile_title">Trips</div>
                                {this.props.blogAuth.user.trips.map(this.renderTripLinks)}
                            </Col>
                        </Col>
                    </Row>

                    <Row className="show-grid Profile_actions">
                        <Col xs={8} md={8}>
                            <Button
                                disabled={!this.props.blogAuth.isLoggedIn}
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

export default withRouter(withBlogAuth(Profile)); 