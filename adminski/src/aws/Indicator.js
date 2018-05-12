import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './Indicator-styles.css';

//constants for fade in and fade out transition states
const STAGE_FADE_IN = 'STAGE_FADE_IN';
const STAGE_FADE_OUT = 'STAGE_FADE_OUT';

/*
shows success or failure icon with fade in and fade out animation 
*/
class Indicator extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            transitionStage: null
        }
    }

    componentDidMount() {
        //delay fade in
        _.delay(() => {
            this.setState({ transitionStage: STAGE_FADE_IN }, this.fadeOutAfterDelay);
        }, 100);
    }

    //will change state to fading out after a few seconds
    fadeOutAfterDelay = () => {
        _.delay(() => {
            this.setState({ transitionStage: STAGE_FADE_OUT });
        }, 2000);
    }

    render() {
        //get CSS class for current animation (empty by default)
        let stageCssClass = '';
        if (this.state.transitionStage === STAGE_FADE_IN) {
            stageCssClass = 'statusAreaVisible';
        }
        else if (this.state.transitionStage === STAGE_FADE_OUT) {
            stageCssClass = 'statusAreaHidden';
        }

        //error case
        let indicatorIconText = 'error';
        let indicatorColorClass = 'failureColor'
        if (this.props.success) {
            //success case
            indicatorColorClass = 'successColor'
            indicatorIconText = 'done';
        }

        return (
            <div className={`statusArea ${stageCssClass}`} >
                <i className={`material-icons ${indicatorColorClass}`}  >{indicatorIconText}</i>
            </div>
        );
    }
}

Indicator.propTypes = {
    success: PropTypes.bool
}

export default Indicator;