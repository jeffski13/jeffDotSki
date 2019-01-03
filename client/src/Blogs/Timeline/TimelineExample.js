import React from 'react';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';

import Timeline from './index';

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
            <div className="timeline-page-content-section" key={nextBlog.id}>
                <ScrollableAnchor id={nextBlog.id}>
                    <div>
                        <h3>{nextBlog.id}</h3>
                        Date: {nextBlog.date}
                    </div>
                </ScrollableAnchor>
            </div>
        );
    }

    render() {
        let timelineLinksInfo = [];
        this.state.blogs.map((nextBlog)=>{
            timelineLinksInfo.push({
                popoverText: nextBlog.date,
                elementId: nextBlog.id
            })
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