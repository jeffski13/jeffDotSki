import React, { Component } from 'react';
import { Card, Container, Row, Col, ButtonGroup, Button } from 'react-bootstrap';

import { STATUS_FAILURE, STATUS_SUCCESS, STATUS_LOADING } from '../Network/consts';
import Loadingski from '../Inf/Loadingski';
import { MONTHS } from './blog-consts';
import BlogPage from './BlogPage';
import Timeline from './Timeline';
import moment from 'moment';
import { getBlogsSecure } from '../TravelersTrails/GETblogs';
import { getTripSecure } from '../TravelersTrails/GETtrip';
import { jeffskiRoutes } from '../app';
import './styles.css';
import withBlogAuth from '../TravelersTrails/Auth/withBlogAuth';

export const MOBILE_WINDOW_WIDTH = 850;

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
            }
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
        this.handleWindowSizeChange();
        this.setState({
            networkStatus: STATUS_LOADING
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
                this.setState({
                    tripName: data.name,
                    networkStatus: STATUS_SUCCESS
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

    render() {
        let failureMessageRender = null;
        if (this.state.networkStatus === STATUS_FAILURE) {
            if (this.state.blogsResults.error.status === 404) {
                failureMessageRender = (
                    <div className="Blogs">
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
                    </div>
                );
            }
            else if (this.state.blogsResults.error.status === 403) {
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

        if (this.state.blogsResults.blogsArr && this.state.hasInitiallySorted) {
            let timelineLinksInfo = this.getTimelineLinksInfo();

            //adjust css classes for mobile
            let blogHeaderClass = '';
            if (this.state.isViewMobile) {
                blogHeaderClass = 'Blogs_mobile';
            }

            blogsArea = (
                <div className="Blogs">
                    <Container>
                        <Row className={`show-grid ${blogHeaderClass}`}>
                            <Col xs={8} md={6}>
                                <div className="blogBrowserTitle">{this.state.tripName}</div>
                            </Col>
                            <Col xs={4} md={6} className="Blogs_controls-wrapper">
                                <div className="Blogs_controls">
                                <div className="Blogs_controls-date">{timelineLinksInfo[0].popoverText}</div>
                                    <ButtonGroup>
                                        <Button
                                            variant="secondary"
                                            onClick={() => {
                                                this.reverseBlogOrder();
                                            }}
                                        >
                                            <i className="material-icons navigation-icon-button">
                                                swap_vert
                                            </i>
                                        </Button>
                                    </ButtonGroup>
                                <div className="Blogs_controls-date">{timelineLinksInfo[timelineLinksInfo.length - 1].popoverText}</div>
                                </div>
                            </Col>
                        </Row>
                        <Row className={blogHeaderClass}>
                            <Col xs={12}>
                                <div className="BlogList">
                                    {this.state.blogsResults.blogsArr.map(this.renderSampleBlogItem)}

                                    <Timeline
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