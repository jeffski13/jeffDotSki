import React from 'react';
import PropTypes from 'prop-types';
import { OverlayTrigger, Tooltip, ButtonGroup, Button } from 'react-bootstrap';
import './styles.css';

/**
 * creates dots on the right side of the screen which can be clicked on and navigated to
 */
export default class Timeline extends React.Component {

    static propTypes = {
        // array of info for links that are on the page to which we want to navigate:
        // {
        //   elementId: string - the header/title for the blog
        //   popoverText: string - the tooltip like text which will appear
        //   isSectionVisible: string - true if the section corresponding to this linkinfo index is visible
        //      NOTE: should only be true for one item at a time in the linksInfo array
        // }
        linksInfo: PropTypes.array.isRequired,
        // onTimelineClickedCallback(indexOfClickedTimelineItem)
        // indexOfClickedTimelineItem: number - the index of the timeline item that was clicked
        onTimelineClickedCallback: PropTypes.func
    }

    //default onTimelineClickedCallback to empty function to avoid crash
    static defaultProps = {
        onTimelineClickedCallback: () => { }
    };

    constructor(props) {
        super(props);
        this.state = {
            windowHeight: window.innerHeight,
            navWidth: 30,
            totalHeightFraction: 0.75
        }
    }

    componentWillMount() {
        // add a listener for the screen size since we have a mobile view
        window.addEventListener('resize', this.handleWindowSizeChange);
    }

    componentWillUnmount() {
        // make sure to remove the listener for the screen size
        // when the component is not mounted anymore
        window.removeEventListener('resize', this.handleWindowSizeChange);
    }

    handleWindowSizeChange = () => {
        this.setState({ windowHeight: window.innerHeight });
    };

    renderDatePoints = (nextLinkInfo, index) => {
        let endLengths = 10;
        let totalHeight = this.state.windowHeight * this.state.totalHeightFraction;

        let svgCenterY = endLengths + index * ((totalHeight - (2 * endLengths)) / (this.props.linksInfo.length - 1));

        let circleFillColor = 'grey';
        if (nextLinkInfo.isSectionVisible) {
            circleFillColor = 'black';
        }

        console.log('rendering timeline ', index, 'max height:', totalHeight);

        return (
            <LinkWithTooltip
                key={'timelineLink-' + index + '-' + nextLinkInfo.elementId}
                id={'timelineLink-' + index + '-' + nextLinkInfo.elementId}
                tooltip={nextLinkInfo.popoverText}
                href={'#' + nextLinkInfo.elementId}
                onAnchorClickedCallback={() => {
                    this.props.onTimelineClickedCallback(index);
                }}
            >
                <circle
                    cx={this.state.navWidth / 2} cy={svgCenterY} r="9"
                    stroke="grey" strokeWidth="2" fill={circleFillColor}
                />
            </LinkWithTooltip>
        );
    }

    render() {
        let totalHeight = this.state.windowHeight * this.state.totalHeightFraction;

        return (
            <div className="Timeline_sidenav" >
                <div>
                    <div className="Blogs_controls-date">{this.props.linksInfo[0].popoverText}</div>
                    <ButtonGroup>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                this.props.onReverseOrderClickedCallback();
                            }}
                        >
                            <i className="material-icons navigation-icon-button">
                                swap_vert
                            </i>
                        </Button>
                    </ButtonGroup>

                    <div className="Blogs_controls-date">{this.props.linksInfo[this.props.linksInfo.length - 1].popoverText}</div>
                </div>
                <div>
                    <svg height={totalHeight} width={this.state.navWidth}>
                        {this.props.linksInfo.map(this.renderDatePoints)}
                    </svg>
                </div>
            </div>
        );
    }
}

/**
 * id: string - the id of the link element
 * children: string - what the link will look like ()
 * href: string - the id of the element to which the link will go
 * tooltip: the text 
 */
function LinkWithTooltip({ id, children, href, tooltip, onAnchorClickedCallback }) {
    return (
        <OverlayTrigger
            overlay={<Tooltip id={id}>{tooltip}</Tooltip>}
            placement="left"
            delayShow={100}
            delayHide={200}
        >
            <a
                href={href}
                onClick={() => {
                    onAnchorClickedCallback();
                }}
            >
                {children}
            </a>
        </OverlayTrigger>
    );
}