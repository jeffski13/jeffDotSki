import React, { Component } from 'react';
import AirplaneLoader from './index';

import './overlay-styles.css';

class Overlay extends Component {
    render() {
        return (
            <div id="loading-overlayski">
                <AirplaneLoader />
            </div>
        );
    }
}

export default Overlay;