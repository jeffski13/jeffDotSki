import React, { Component } from 'react';
import { Card, Container, Row, Col, ButtonGroup, Button, Form, FormGroup, FormControl } from 'react-bootstrap';

import withBlogAuth from '../TravelersTrails/Auth/withBlogAuth';
import { updateTripSecure } from '../TravelersTrails/TripsForUser';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../Network/consts';
import { validateFormString, FORM_SUCCESS } from '../formvalidation';
import Loadingski from '../Inf/Loadingski';
import { MONTHS } from './blog-consts';
import BlogPage from './BlogPage';
import Timeline from './Timeline';
import moment from 'moment';
import { getBlogsSecure } from '../TravelersTrails/GETblogs';
import { getTripSecure } from '../TravelersTrails/GETtrip';
import { getBlogUserSecure } from '../TravelersTrails/BlogUser';
import { jeffskiRoutes } from '../app';
import './styles.css';

export const MOBILE_WINDOW_WIDTH = 850;

const initialTripFormState = {
    name: {
        value: '',
        isValid: false,
        validationMessage: ''
    },
    isValidated: false
};
class Blogs extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isViewMobile: false,
            networkStatus: null, //refactor, need to make this and object with trip and blogs properties, then key off those
            tripName: '',
            sortBlogsDateDescending: false,
            hasInitiallySorted: false,
            blogShowing: {
                id: '',
                percentage: -1
            },
            blogsResults: {
                error: {
                    status: null,
                    message: null,
                    code: null
                },
                blogsArr: null,
            },
            isEditEnabled: false,
            isEditingTrip: false,
            editTripNetwork: null,
            editTripForm: initialTripFormState,
        };
    }

    componentWillMount() {
        // add a listener for the screen size since we have a mobile view
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    // make sure to remove the listener for the screen size
    // when the component is not mounted anymore
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        let isMobile = false;
        if (window.innerWidth < MOBILE_WINDOW_WIDTH) {
            isMobile = true;
        }
        this.setState({ isViewMobile: isMobile });
    };

    componentDidUpdate(previousProps) {
        if ((!previousProps.reduxBlogAuth.authState.hasDoneInitialAuthCheck
            && this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) || (previousProps.match.params.userId !== this.props.match.params.userId)) {
            this.getBlogData();
        }
        //if user logs out they cannot possibly edit the blog
        if (previousProps.reduxBlogAuth.authState.isLoggedIn && !this.props.reduxBlogAuth.authState.isLoggedIn) {
            this.setState({
                isEditEnabled: false
            });
        }
    }

    componentDidMount() {
        //loading blogs
        this.setState({
            networkStatus: STATUS_LOADING
        });

        //REFACTOR? should we move this call into the withBlogAuth itself and just let the 
        // component did update check hang out since each page will require something different?
        //if we hit this page for the first time we might not know if we are logged in
        if (!this.props.reduxBlogAuth.authState.hasDoneInitialAuthCheck) {
            //perform initial auth check
            this.props.blogAuth.checkForAuth();
        }
        else {
            this.getBlogData();
        }
    }

    getBlogData = () => {
        let isUserBlogOwner = false;
        //if user is logged in and looking at his or her own blogs, show edit links
        if (this.props.reduxBlogAuth.authState.isLoggedIn && (this.props.reduxBlogAuth.userInfo.id === this.props.match.params.userId || !this.props.match.params.userId)) {
            isUserBlogOwner = true;
        }
        else {
            isUserBlogOwner = false;
        }

        this.handleWindowSizeChange();
        this.setState({
            isEditEnabled: isUserBlogOwner,
            networkStatus: STATUS_LOADING,
            blogUserNetwork: STATUS_LOADING
        }, () => {
            //default to chile for now
            let tripId = 'uuid1234';
            //if user provides trip id in the the path use it to look up blogs
            if (this.props.match.params.tripId) {
                tripId = this.props.match.params.tripId;
            }
            getBlogsSecure(this.props.match.params.userId, tripId, (err, data) => {
                if (err) {
                    return this.setState({
                        networkStatus: STATUS_FAILURE,
                        blogsResults: {
                            error: {
                                status: err.status,
                                message: err.data.message,
                                code: err.data.code
                            }
                        }
                    });
                }
                this.setState({
                    blogsResults: {
                        blogsArr: data,
                    },
                    networkStatus: STATUS_SUCCESS
                }, () => {
                    this.sortBlogsByDate(this.state.sortBlogsDateDescending);
                });
            });
            getTripSecure(this.props.match.params.userId, tripId, (err, data) => {
                if (err) {
                    console.log('trip error returned', err);
                    return this.setState({
                        networkStatus: STATUS_FAILURE,
                        blogsResults: {
                            error: {
                                status: err.status,
                                message: err.data.message,
                                code: err.data.code
                            }
                        }
                    });
                }
                console.log('trip data returned', data);
                let tripFormNameState = initialTripFormState;
                tripFormNameState.name.value = data.name;
                this.setState({
                    tripName: data.name,
                    networkStatus: STATUS_SUCCESS,
                    editTripForm: tripFormNameState
                });
            });

        });
    }

    reverseBlogOrder = () => {
        this.setState({
            sortBlogsDateDescending: !this.state.sortBlogsDateDescending
        }, () => {
            this.sortBlogsByDate();
        });
    }

    sortBlogsByDate = () => {

        let sortingHatSwitch = -1;
        if (this.state.sortBlogsDateDescending) {
            sortingHatSwitch = 1;
        }
        let sortedBlogsArr = this.state.blogsResults.blogsArr;

        sortedBlogsArr.sort((trip, nextTrip) => {
            if (trip.date < nextTrip.date) {
                return 1 * sortingHatSwitch;
            }
            if (trip.date > nextTrip.date) {
                return -1 * sortingHatSwitch;
            }
            return 0;
        });

        this.setState({
            blogsArr: sortedBlogsArr,
            hasInitiallySorted: true
        });
    }

    getTimelineLinksInfo = () => {
        let timelineLinkInfo = [];

        //at this point we assume the blogs are sorted in order
        this.state.blogsResults.blogsArr.forEach((nextBlog) => {
            let blogMoment = moment.unix(nextBlog.date);
            let blogMonth = MONTHS[blogMoment.month()];
            let blogDateOfMonth = blogMoment.date();

            let isNextBlogVisible = false;
            if (this.state.blogShowing.id === nextBlog.id) {
                isNextBlogVisible = true;
            }

            timelineLinkInfo.push({
                popoverText: `${blogMonth.substring(0, 3)} ${blogDateOfMonth}`,
                elementId: nextBlog.id,
                isSectionVisible: isNextBlogVisible
            })
        });

        return timelineLinkInfo;
    }

    isValidTripName = (tripNameInQuestion) => {
        return validateFormString(tripNameInQuestion) === FORM_SUCCESS;
    }

    //returns true if the blog is ready to be submitted to the server
    isEditTripFormSubmitAllowed = () => {
        //form should not submit if we are currently uploading anything
        if (this.state.editTripNetwork === STATUS_LOADING) {
            return false;
        }

        if (this.state.editTripForm.name.isValid) {
            return true;
        }

        return false;
    }

    submitEditTripForm = (event) => {
        // if we have valid trip name and we are not loading right now, try to create a new trip
        event.preventDefault();
        event.stopPropagation();
        if (this.isEditTripFormSubmitAllowed()) {
            this.updateTripName();
        }
        this.setState({
            editTripForm: { ...this.state.editTripForm, isValidated: true }
        });
    }

    updateTripName = () => {
        this.setState({
            editTripNetwork: STATUS_LOADING
        }, () => {
            let tripInfo = {
                name: this.state.editTripForm.name.value
            }
            //default to chile for now
            let tripId = 'uuid1234';
            //if user provides trip id in the the path use it to edit trip name
            if (this.props.match.params.tripId) {
                tripId = this.props.match.params.tripId;
            }
            updateTripSecure(this.props.reduxBlogAuth.userInfo.id, tripId, tripInfo, (err, data) => {
                if (err) {
                    return this.setState({
                        editTripNetwork: STATUS_FAILURE,
                        editTripResults: {
                            status: err.status,
                            message: err.data.message,
                            code: err.data.code
                        }
                    });
                }

                let editTripFormState = this.state.editTripForm;
                editTripFormState.name.value = data.name;

                this.setState({
                    editTripNetwork: STATUS_SUCCESS,
                    editTripForm: editTripFormState,
                    isEditingTrip: false,
                    tripName: data.trip.name,
                });
            });
        })
    }

    //renders all paragraphs except the first
    renderSampleBlogItem = (nextBlog) => {
        return (
            <BlogPage
                key={nextBlog.id}
                invisibleAnchorId={nextBlog.id}
                isViewMobile={this.state.isViewMobile}
                blog={nextBlog}
                blogAnchorId={`idForBlogPercentageView-${nextBlog.id}`}
                percentageInViewCallback={(percentageShowing, blogId) => {

                    //determine which section is most visible and update state with findings
                    if (this.state.blogShowing.id === blogId) {
                        //if we get an id that is already deteremined to be "visible", just update percentage
                        this.setState({
                            blogShowing: {
                                id: blogId,
                                percentage: percentageShowing
                            }
                        });
                    }
                    else if (percentageShowing > this.state.blogShowing.percentage) {
                        //if we get a different id than what is "visible", see if the percentage showing is larger than the "visible", then update with new id and percentage
                        this.setState({
                            blogShowing: {
                                id: blogId,
                                percentage: percentageShowing
                            }
                        });
                    }

                }}
            />
        );
    }

    renderBlogTitleRow = (blogHeaderClass) => {
        // display different UI depending on if we are editing trip name
        
        let blogRowContent;
        if(!this.state.isEditEnabled){
            blogRowContent = (
                <div className="blogBrowserTitle">{this.state.tripName}</div>
            );
        }
        else {
            if (!this.state.isEditingTrip) {
                blogRowContent = (
                    <div className="blogBrowserTitle">{this.state.tripName}
                        <span>    
                            <Button
                                onClick={() => this.setState({isEditingTrip: true}) }
                                variant="secondary"
                            >
                                <i className="material-icons">edit</i>
                            </Button>
                        </span>
                    </div>
                );
            }
            else {
                let editTripMessage = null;
                if (this.state.editTripNetwork === STATUS_FAILURE) {
                    editTripMessage = (
                        <div className="Profile_trip-section-addTripErrorMesssage">An error occured. Please try again later.</div>
                    )
                }
    
                blogRowContent = (
                    <Form
                        className="Profile_trip-section-addTripForm"
                        onSubmit={e => this.submitAddNewTripForm(e)}
                    >
                        <FormGroup
                            controlId="nameFormInput"
                        >
                            <label className="has-float-label">
                                <FormControl
                                    type="text"
                                    value={this.state.editTripForm.name.value || ''}
                                    placeholder="Name Your Adventure"
                                    onChange={(e) => {
                                        let tripUpdateInfo = {
                                            name: {
                                                value: e.target.value,
                                                isValid: this.isValidTripName(e.target.value)
                                            }
                                        };
                                        this.setState({
                                            editTripForm: { ...this.state.editTripForm, ...tripUpdateInfo }
                                        });
                                    }}
                                    isInvalid={this.state.editTripForm.isValidated && !this.state.editTripForm.name.isValid}
                                    onBlur={this.submitEditTripForm}
                                    disabled={this.state.editTripNetwork === STATUS_LOADING}
                                />
                                <span>Edit Trip</span>
                                <Form.Control.Feedback type="invalid">
                                    {this.state.editTripForm.name.validationMessage || 'Your trip name must be unique.'}
                                </Form.Control.Feedback>
                            </label>
                        </FormGroup>
                        {editTripMessage}
                    </Form>
                );
                
            }
        }

        
        let blogTitleRow = (
            <Row className={`show-grid ${blogHeaderClass}`}>
                <Col xs={8} md={6} lg={8}>
                    {blogRowContent}
                </Col>
                <Col xs={4} md={6} className="Blogs_controls-wrapper">

                </Col>
            </Row>
        );
        return blogTitleRow;
    }

    render() {
        let failureMessageRender = null;
        if (this.state.networkStatus === STATUS_FAILURE) {
            if (this.state.blogsResults.error.status === 403) {
                failureMessageRender = (
                    <div className="Blogs">
                        <div className="Blogs_error" >
                            <Card bg="warning" text="white" style={{ width: '18rem' }}>
                                <Card.Header>Sorry!</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <span>
                                            <span>This blog is private.</span>
                                            <span className="Blogs_error-refresh" >
                                                <Button
                                                    onClick={() => {
                                                        //go back to profile
                                                        this.props.history.push(`${jeffskiRoutes.travelTrailsHome}/${this.props.reduxBlogAuth.userInfo.id}`);
                                                    }}
                                                    bsStyle="link"
                                                >
                                                    Go To Profile
                                            </Button>
                                            </span>
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                );
            }
            else {
                failureMessageRender = (
                    <div className="Blogs">
                        <div className="Blogs_error" >
                            <Card bg="danger" text="white" style={{ width: '18rem' }}>
                                <Card.Header>Houston, we have a problem.</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <span>
                                            <span>Something went wrong while getting the blogs.</span>
                                            <span className="Blogs_error-refresh" >
                                                <Button
                                                    onClick={() => { window.location.reload() }}
                                                    variant="link"
                                                >
                                                    Refresh?
                                            </Button>
                                            </span>
                                        </span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                );
            }
        }

        let blogsArea = null;
        let blogsContent = null;

        if (this.state.blogsResults.blogsArr && this.state.hasInitiallySorted) {

            let timelineLinksInfo = this.getTimelineLinksInfo();

            //adjust css classes for mobile
            let blogHeaderClass = '';
            if (this.state.isViewMobile) {
                blogHeaderClass = 'Blogs_mobile';
            }

            if (this.state.blogsResults.blogsArr.length === 0) {
                blogsContent = (
                    <div className="Blogs_error" >
                        <Card bg="info" text="white" style={{ width: '18rem' }}>
                            <Card.Header>Hmm...</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    <span>
                                        <span>It looks like this trip is empty.</span>
                                        <span className="Blogs_error-refresh" >
                                            <Button
                                                onClick={() => {
                                                    //go back to profile
                                                    this.props.history.push(`${jeffskiRoutes.travelTrailsHome}/${this.props.reduxBlogAuth.userInfo.id}`);
                                                }}
                                                bsStyle="link"
                                            >
                                                Go To Profile
                                            </Button>
                                        </span>
                                    </span>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                );
            }
            else {
                blogsContent = (
                    <Row className={blogHeaderClass}>
                        <Col xs={12}>
                            <div className="BlogList">
                                {this.state.blogsResults.blogsArr.map(this.renderSampleBlogItem)}

                                <Timeline
                                    onReverseOrderClickedCallback={this.reverseBlogOrder}
                                    linksInfo={timelineLinksInfo}
                                    onTimelineClickedCallback={(indexOfClicked) => {
                                        //delay until transition of movement is over
                                        setTimeout(() => {
                                            //we can assume this is showing 100%. This will fix itself in the callbacks, but will stop blogs offscreen from taking over with a 0%
                                            this.setState({
                                                blogShowing: {
                                                    id: this.state.blogsResults.blogsArr[indexOfClicked].id,
                                                    percentage: 100
                                                }
                                            });
                                        }, 700);
                                    }}
                                />
                            </div>
                        </Col>
                    </Row>
                );
            }
            blogsArea = (
                <div className="Blogs">
                    <Container>
                        {this.renderBlogTitleRow(blogHeaderClass)}
                        {blogsContent}
                    </Container>
                </div >
            );

        }
        return (
            <div>
                {this.state.networkStatus === STATUS_LOADING && <Loadingski />}
                {this.state.networkStatus === STATUS_SUCCESS && blogsArea}
                {this.state.networkStatus === STATUS_FAILURE && failureMessageRender}
            </div>
        );

    }

}

export default withBlogAuth(Blogs);