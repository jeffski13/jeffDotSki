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
            dateDescending: false
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

            timelineLinkInfo.push({
                popoverText: `${blogMonth.substring(0,3)} ${blogDateOfMonth}`,
                elementId: nextBlog.id
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