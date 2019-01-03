import React, { Component } from 'react';
import { Row, Col, ButtonGroup, Button } from 'react-bootstrap';
import moment from 'moment';

import {MONTHS} from './blog-consts';
import BlogPage from './BlogPage';
import Timeline from './Timeline';
import './styles.css';

export default class BlogList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            blogs: [],
            dateDescending: false,
            blogShowing: {
                id: '',
                percentage: -1
            }
        };
    }

    componentDidMount() {
        this.setState({
            blogs: this.props.blogs
        }, () => {
            this.sortBlogsByDate(this.state.dateDescending);
        });
    }

    sortBlogsByDate = (shouldDescend) => {
        let sortingHatSwitch = -1;
        if (shouldDescend) {
            sortingHatSwitch = 1;
        }
        let sortedBlogsArr = this.state.blogs;

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
            blogs: sortedBlogsArr,
            dateDescending: shouldDescend
        });

    }

    getTimelineLinksInfo = () => {
        let timelineLinkInfo = [];

        //at this point we assume the blogs are sorted in order
        this.state.blogs.map((nextBlog)=> {
            let blogMoment = moment.unix(nextBlog.date);
            let blogMonth = MONTHS[blogMoment.month()];
            let blogDateOfMonth = blogMoment.date();

            let isNextBlogVisible = false;
            if(this.state.blogShowing.id === nextBlog.id){
                isNextBlogVisible = true;
            }
            
            timelineLinkInfo.push({
                popoverText: `${blogMonth.substring(0,3)} ${blogDateOfMonth}`,
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
                blog={nextBlog}
                blogAnchorId={`idForBlogPercentageView-${nextBlog.id}`}
                percentageInViewCallback={(percentageShowing, blogId)=> {

                    //determine which section is most visible and update state with findings
                    if(this.state.blogShowing.id === blogId){
                        //if we get an id that is already deteremined to be "visible", just update percentage
                        this.setState({ 
                            blogShowing: {
                                id: blogId,
                                percentage: percentageShowing
                            }
                        });
                    }
                    else if(percentageShowing > this.state.blogShowing.percentage){ 
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
        //null if no data
        if (!this.state.blogs) {
            return null;
        }

        let timelineLinksInfo = this.getTimelineLinksInfo();

        return (
            <div className="BlogList">
                <Row className="show-grid">
                    <Col xs={12} md={12}>
                        <div className="Blogs-controls">
                            <span className="BlogList-dateSortControls">Date Order: </span>
                            <ButtonGroup>
                                <Button
                                    disabled={!this.state.dateDescending}
                                    onClick={() => {
                                        this.sortBlogsByDate(false);
                                    }}
                                    >
                                    <i className="material-icons navigation-icon-button">
                                        arrow_downward
                                    </i>
                                </Button>
                                <Button
                                    disabled={this.state.dateDescending}
                                    onClick={() => {
                                        this.sortBlogsByDate(true);
                                    }}
                                    >
                                    <i className="material-icons navigation-icon-button">
                                        arrow_upward
                                    </i>
                                </Button>
                            </ButtonGroup>
                        </div>
                    </Col>
                </Row>

                {this.state.blogs.map(this.renderSampleBlogItem)}

                <Timeline linksInfo={timelineLinksInfo} />
            </div>
        );

    }

}