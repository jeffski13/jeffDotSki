import React from 'react';
import Prototypes from 'prop-types';
import { DropdownButton, Dropdown } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import 'react-datepicker/dist/react-datepicker.css';
import {storeBlogDate} from './actions';
import './BlogDate-styles.css';

class BlogDate extends React.Component {

    constructor(props) {
        super(props);

    }

    render() {
        let minuteString = this.props.blogCreation.date.minute().toString();
        if(minuteString.length < 2){
            minuteString = `0${minuteString}`
        }
        let amOrPm = 'AM';
        if(this.props.blogCreation.date.hour() > 12){
            amOrPm = 'PM';
        }
        let timeOfDaySelected = ` ${this.props.blogCreation.date.hour() % 12}:${minuteString} ${amOrPm}`
        console.log(`this.props.blogCreation.date: ${this.props.blogCreation.date}`);
        return (
            <div className="form-group">
                <DatePicker
                    selected={this.props.blogCreation.date}
                    onChange={ date => {
                        this.props.storeBlogDate(date);
                    }}
                    className="form-control"
                    disabled={this.props.isDisabled}
                    maxDate={new Date()}
                    showTimeSelect
                />{timeOfDaySelected}
            </div>
        );
    }
}

BlogDate.prototypes = {
    isDisabled: Prototypes.bool
};

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ storeBlogDate }, dispatch);
}

function mapStateToProps({ blogCreation }) {
    return { blogCreation };
}

export default connect(mapStateToProps, mapDispatchToProps)(BlogDate);