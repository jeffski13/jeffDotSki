import React, { Component } from 'react';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';

import withBlogAuth from '../TravelersTrails/Auth/withBlogAuth';
import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../Network/consts';
import Loadingski from '../Inf/Loadingski';
import { MONTHS } from './blog-consts';
import BlogPage from './BlogPage';
import Timeline from './Timeline';
import moment from 'moment';
import { getBlogsSecure } from '../TravelersTrails/GETblogs';
import { getBlogUserSecure } from '../TravelersTrails/BlogUser';
import { jeffskiRoutes } from '../app';
import './styles.css';
import TripName from '../TravelersTrails/Trips/TripName';

export const MOBILE_WINDOW_WIDTH = 850;

class Blogs extends Component {

    constructor(props) {
        super(props);
        this.editNameInputRef = React.createRef();
        this.state = {
            isViewMobile: false,
            networkStatus: null, //REFACTOR, need to make this and object with trip and blogs properties, then key off those
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
            isEditing: false
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

    componentDidUpdate(previousProps, previousState) {
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

    getBlogData = () => {
        let isUserBlogOwner = false;
        //if user is logged in and looking at his or her own blogs, show edit links
        console.log(`jeffski: ${this.props.match.params.userId}`);
        if (this.props.reduxBlogAuth.authState.isLoggedIn && (this.props.reduxBlogAuth.userInfo.id === this.props.match.params.userId || !this.props.match.params.userId)) {
            isUserBlogOwner = true;
        }
        else {
            isUserBlogOwner = false;
        }
        //REFACTOR? move up to componentDidMount?
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

    renderBlogHeaderRow = (blogHeaderClass) => {
        // display different UI depending on two things:
        // 1) if user owns blog
        // 2) if user is in an edit mode

        let blogControls = null;
        if (this.state.isEditEnabled) {
            blogControls = (
                <div className="Blogs_controls-add-blog">
                    <Button
                        onClick={() => {
                            //go back to profile
                            this.props.history.push(`${jeffskiRoutes.travelTrailsHome}/${this.props.reduxBlogAuth.userInfo.id}`);
                        }}
                        variant="success"
                        size="lg"
                        disabled={this.state.isEditing}
                    >
                        <i className="material-icons">add</i>Add Blog
                    </Button>
                </div>
            );
        }

        //default trip is Chile for my personal website purposes
        let tripId = 'uuid1234';
        if(this.props.match.params.tripId){
            tripId = this.props.match.params.tripId;
        }

        return (
            <Row className={`show-grid ${blogHeaderClass}`}>
                <Col xs={8} md={6} lg={8}>
                    <TripName
                        isEditingTripCallback={isEditingTrip => {this.setState({ isEditing: isEditingTrip})}}
                        tripOwnerId={this.props.match.params.userId}
                        tripId={tripId}
                    />
                </Col>
                <Col xs={4} md={6} className="Blogs_controls-wrapper">
                    {blogControls}
                </Col>
            </Row>
        );
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
                                                    variant="link"
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
                        {this.renderBlogHeaderRow(blogHeaderClass)}
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