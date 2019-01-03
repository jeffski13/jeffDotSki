import React from 'react';
import PropTypes from 'prop-types';
import { Overlay, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
        // }
        linksInfo: PropTypes.array.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            windowHeight: window.innerHeight,
            navWidth: 50
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
        let endLengths = 35;
        let totalHeight = this.state.windowHeight * 0.75;

        let svgCenterY = endLengths + index * ((totalHeight - (2 * endLengths)) / (this.props.linksInfo.length - 1));

        let circleFillColor = 'grey';
        if(nextLinkInfo.isSectionVisible){
            circleFillColor = 'black';
        }

        return (
            <LinkWithTooltip tooltip={nextLinkInfo.popoverText} href={'#' + nextLinkInfo.elementId}>
                <circle
                    cx={this.state.navWidth / 2} cy={svgCenterY} r="9"
                    stroke="grey" stroke-width="2" fill={circleFillColor}
                />
            </LinkWithTooltip>
        );
    }

    render() {
        let totalHeight = this.state.windowHeight * 0.75;

        return (
            <div className="Timeline_sidenav" >
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