import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './styles.css';

class Indicator extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            stage: 0
        }
    }

    componentDidMount(){
        //delay fade in
        _.delay(()=>{
            this.setState({stage: 1}, this.delayFadeOut);
        }, 100);
    }

    delayFadeOut = () =>{
        _.delay(()=>{
            this.setState({stage: 0});
        }, 2000);
    }

    render() {
        let stageCssClass = [
            'statusAreaHidden',
            'statusAreaVisible',
            'statusAreaHidden'
        ];
    
        let indicatorIconText = 'error';
        let indicatorColorClass = 'failureColor'
        if(this.props.success){
            indicatorColorClass = 'successColor'
            indicatorIconText = 'done';
        }

        return (
            <div className={`statusArea ${stageCssClass[this.state.stage]}`} >
                <i className={`material-icons ${indicatorColorClass}`}  >{indicatorIconText}</i>
            </div>
        );
    }
}

Indicator.propTypes = {
    success: PropTypes.bool
}

export default Indicator;