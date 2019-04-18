import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';

import Indicator from '../../../Network/Indicator';
import { STATUS_LOADING, STATUS_FAILURE, STATUS_SUCCESS } from '../../../Network/consts';
import { getTripsSecure } from '../../TripsForUser';
import {  getTripSecure } from '../../GETtrip';
import './styles.css';

export default class TripsDropdown extends React.Component {

    static propTypes = {
        onTripReturned: PropTypes.func.isRequired,
        onTripSelected: PropTypes.func,
        onTripsReturned: PropTypes.func,
        // if false, will sort by date
        sortAlphabetically: PropTypes.bool,
        //refresh counter: could be anything just needs to change to refresh
        refreshProp: PropTypes.any
    };

    //default onTripsReturned to empty function to avoid crash
    static defaultProps = {
        onTripsReturned: () => { },
        onTripSelected: () => { },
        sortAlphabetically: true
    };

    constructor(props) {
        super(props);
        this.state = {
            getTripsStatus: null,
            getTripResults: {
                status: null,
                message: null,
                code: null
            },
            availableTrips: [],
            tripInfo: null,
            tripIndexSelected: -1
        };
    }

    componentDidUpdate(prevProps) {
        //wipe out our data on refresh update
        if (this.props.refreshProp !== prevProps.refreshProp) {
            this.setState({
                getTripsStatus: null,
                getTripResults: {
                    status: null,
                    message: null,
                    code: null
                },
                availableTrips: [],
                tripInfo: null,
                tripIndexSelected: -1
            }, () => {
                this.getTrips();
            });
        }
    }

    componentDidMount() {
        this.getTrips();
    }

    getTrips = () => {
        //get a list of all the trips when app starts
        this.setState({ getTripsStatus: STATUS_LOADING });
        getTripsSecure((err, tripData) => {
            if (err) {
                return this.setState({
                    getTripsStatus: STATUS_FAILURE,
                    getTripResults: {
                        message: err.data.message,
                        code: err.data.code,
                        status: err.status
                    }
                });
            }
            if (this.props.sortAlphabetically) {
                tripData.sort(function (tripA, tripB) {
                    var tripAName = '';
                    if (tripA.name) {
                        tripAName = tripA.name.toLowerCase();
                    }
                    var tripBName = '';
                    if (tripB.name) {
                        tripBName = tripB.name.toLowerCase();
                    }
                    if (tripAName < tripBName) { return -1; }
                    if (tripAName > tripBName) { return 1; }
                    return 0;
                });
            }
            else {
                tripData.sort(function (tripA, tripB) {
                    var tripADate = tripA.year + (tripA.month / 100);
                    var tripBDate = tripB.year + (tripB.month / 100);
                    if (tripADate > tripBDate) { return -1; }
                    if (tripADate < tripBDate) { return 1; }
                    return 0;
                })
            }
            this.setState({
                availableTrips: tripData,
                getTripsStatus: STATUS_SUCCESS
            }, () => {
                this.props.onTripsReturned(this.state.availableTrips);
            });
        });
    }

    renderTripDropdownOptions = (nextTripItem, index) => {
        let tripDisplayName = `${nextTripItem.name}-${nextTripItem.location}-${nextTripItem.year}-${nextTripItem.month}`
        return (
            <option
                key={`${index}-${tripDisplayName}`}
                onSelect={() => {
                    this.onTripSelected(index)
                }}
            >
                {tripDisplayName}
            </option>
        );
    };

    onTripSelected = (tripIndex) => {
        this.setState({
            tripIndexSelected: tripIndex,
            tripInfo: null,
            getTripsStatus: STATUS_LOADING
        }, () => {
            //callback to parent, they will appreciate it
            this.props.onTripSelected();
            //get list of blogs by trip name from server
            getTripSecure(this.state.availableTrips[this.state.tripIndexSelected].id, (err, data) => {
                if (err) {
                    return this.setState({
                        getTripsStatus: STATUS_FAILURE,
                        getTripResults: {
                            message: err.data.message,
                            code: err.data.code,
                            status: err.status
                        }
                    });
                }
                this.setState({
                    tripInfo: data,
                    getTripsStatus: STATUS_SUCCESS
                }, () => {
                    this.props.onTripReturned(this.state.tripInfo);
                });
            });
        });
    }

    render() {
        let tripDropdownValue = "Select A Trip";
        if (this.state.tripIndexSelected > -1 && this.state.availableTrips.length > 0) {
            tripDropdownValue = this.state.availableTrips[this.state.tripIndexSelected].name;
        }

        let getTripMessage = null;
        if (this.state.getTripResults && this.state.getTripResults.message) {
            getTripMessage = (
                <div className="tripServerResults" >
                    <h4>Trip Retrieval Results</h4>
                    <div className="tripServerResultsText" >
                        <div><strong>Message: </strong>{this.state.getTripResults.message}</div>
                        {this.state.getTripResults.code && <div><strong>Code: </strong>{this.state.getTripResults.code}</div>}
                        {this.state.getTripResults.status && <div><strong>Status: </strong>{this.state.getTripResults.status}</div>}
                    </div>
                </div>
            );
        }

        return (
            <div className={`TripsDropdown ${this.props.className}`}>
                <div>
                    <Form.Group controlId="tripSelectDropdown"
                    >
                        <Form.Label>Example select</Form.Label>
                        <Form.Control as="select"
                            disabled={this.state.getTripsStatus === STATUS_LOADING}
                        >
                            {this.state.availableTrips.map(this.renderTripDropdownOptions)}
                        </Form.Control>
                    </Form.Group>
                    <span>
                        {(this.state.getTripsStatus === STATUS_LOADING)
                            && <CircularProgress />}
                        {(this.state.getTripsStatus === STATUS_SUCCESS)
                            && <Indicator success={true} />}
                        {(this.state.getTripsStatus === STATUS_FAILURE)
                            && <Indicator success={false} />}
                    </span>
                </div>
                {getTripMessage}
            </div>
        );
    }
}