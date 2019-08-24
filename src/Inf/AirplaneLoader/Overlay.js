import React, { Component } from 'react';
import AirplaneLoader from './index';

import './overlay-styles.css';

const LOADING_CLASS_BASE = 'loading-overlayski';
const LOADING_CLASS_TRANSITION = 'loading-overlayski-transition';

class Overlay extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingClasses: LOADING_CLASS_BASE
        };
    }
    componentDidMount() {
        this.setState({
            loadingClasses: `${LOADING_CLASS_BASE} ${LOADING_CLASS_TRANSITION}`
        });
    }

    render() {
        return (
            <div className={this.state.loadingClasses}>
                <AirplaneLoader />
            </div>
        );
    }
}

export default Overlay;