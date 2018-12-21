import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ScrollableAnchor, { configureAnchors } from 'react-scrollable-anchor';

import './styles.css';

const linkPrefix = 'jumpToBlog-';

function LinkWithTooltip({ id, children, href, tooltip }) {
    return (
        <OverlayTrigger
            overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
            placement="left"
            delayShow={100}
            delayHide={200}
        >
            <a href={href}>{children}</a>
        </OverlayTrigger>
    );
}

export default class Timeline extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            windowHeight: window.innerHeight,
            navWidth: 50,
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
                }
            ]
        }
    }

    componentWillMount() {
        // add a listener for the screen size since we have a mobile view
        window.addEventListener('resize', this.handleWindowSizeChange);
        //configure anchors with offset to account for ever-present header
        configureAnchors({ offset: -60 });
    }

    componentWillUnmount() {
        // make sure to remove the listener for the screen size
        // when the component is not mounted anymore
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ windowHeight: window.innerHeight });
    };

    renderDatePoints = (nextBlog, index) => {
        let endLengths = 35;
        let totalHeight = this.state.windowHeight * 0.75;

        let svgCenterY = endLengths + index * ((totalHeight - (2 * endLengths)) / (this.state.blogs.length - 1));

        return (
            <LinkWithTooltip tooltip={nextBlog.date} href={'#' + linkPrefix + nextBlog.id}>
                <circle
                    cx={this.state.navWidth / 2} cy={svgCenterY} r="9"
                    stroke="grey" stroke-width="2" fill="grey"
                />
            </LinkWithTooltip>
        );
    }

    renderContentSection = (nextBlog) => {
        return (
            <div className="timeline-page-content-section" key={linkPrefix + nextBlog.id}>
                <ScrollableAnchor id={linkPrefix + nextBlog.id}>
                    <div>
                        <h3>{nextBlog.id}</h3>
                        Date: {nextBlog.date}
                    </div>
                </ScrollableAnchor>
            </div>
        );
    }

    render() {

        let totalHeight = this.state.windowHeight * 0.75;

        return (
            <div className="Timeline">
                <div>Timeline</div>
                <a href={'#' + linkPrefix + 'id1'} >Section 1</a>
                <div id="timeline-page-content">
                    {this.state.blogs.map(this.renderContentSection)}
                </div>

                <div className="Timeline_sidenav" >
                    <div>
                        <svg height={totalHeight} width={this.state.navWidth}>
                            {this.state.blogs.map(this.renderDatePoints)}
                        </svg>
                    </div>
                </div>

            </div>
        );
    }
}