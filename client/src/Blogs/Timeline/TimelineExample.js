import React from 'react';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';

import Timeline from './index';

class TimelineExampleElement extends React.Component {

    componentDidMount() {
        //id for anchor

        //magic from mdn to know when element is on screen
        let observerOptions = {
            root: null,
            rootMargin: "0px",
            threshold: []
        };

        let thresholdSets = [
            [],
            [0.5],
            [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
            [0, 0.25, 0.5, 0.75, 1.0]
        ];

        for (let i = 0; i <= 1.0; i += 0.01) {
            thresholdSets[0].push(i);
        }

        //for debugging only:
        let title = this.props.blog.title;
        observerOptions.threshold = thresholdSets[0];
        let nextBlogObserver = new IntersectionObserver((entries) => {
            entries.forEach(function (entry) {
                let visiblePct = (Math.floor(entry.intersectionRatio * 100)) + "%";
                console.log(title, ' entries are: ', visiblePct);
            });
        }, observerOptions);
        nextBlogObserver.observe(document.querySelector("#" + this.props.nextBlogAnchorId));
    }

    render() {
        console.log('rendering  timelineexampleelement');

        //id is the blog id
        return (
            <div id={this.props.nextBlogAnchorId} className="timeline-page-content-section">
                <ScrollableAnchor id={this.props.blog.id}>
                    <div>
                        <h3>{this.props.blog.id}</h3>
                        Date: {this.props.blog.date}
                    </div>
                </ScrollableAnchor>
            </div>
        );
    }
}

export default class TimelineExample extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            blogs: [
                {
                    date: 'Oct 14',
                    title: 'howdy1',
                    id: 'id1'
                },
                {
                    date: 'Oct 15',
                    title: 'howdy2',
                    id: 'id2'
                },
                {
                    date: 'Oct 16',
                    title: 'howdy3',
                    id: 'id3'
                },
                {
                    date: 'Oct 17',
                    title: 'howdy4',
                    id: 'id4'
                },
                {
                    date: 'Oct 18',
                    title: 'howdy4',
                    id: 'id5'
                },
                {
                    date: 'Oct 19',
                    title: 'howdy4',
                    id: 'id6'
                },
                {
                    date: 'Oct 20',
                    title: 'howdy4',
                    id: 'id7'
                }
            ]
        }
    }

    componentWillMount() {
        //configure anchors with offset to account for ever-present header
        configureAnchors({ offset: -60 });
    }

    renderContentSection = (nextBlog) => {
        return (
            <TimelineExampleElement
                key={nextBlog.id}
                blog={nextBlog}
                nextBlogAnchorId={nextBlog.id}
            />
        );
    }

    render() {
        let timelineLinksInfo = [];
        this.state.blogs.map((nextBlog) => {
            timelineLinksInfo.push({
                popoverText: nextBlog.date,
                elementId: nextBlog.id
            });
        });

        return (
            <div className="Timeline">
                <div>Timeline</div>
                <div id="timeline-page-content">
                    {this.state.blogs.map(this.renderContentSection)}
                </div>

                <Timeline linksInfo={timelineLinksInfo} />

            </div>
        );
    }
}