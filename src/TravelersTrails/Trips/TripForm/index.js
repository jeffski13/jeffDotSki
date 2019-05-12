import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, FormControl, FormGroup, Form } from 'react-bootstrap';

import { validateFormString, validateFormPositiveNumber, FORM_SUCCESS } from '../../../formvalidation';
import './styles.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default class TripForm extends React.Component {
    static propTypes = {
        location: PropTypes.string,
        name: PropTypes.string,
        country: PropTypes.string,
        state: PropTypes.string,
        year: PropTypes.number,
        month: PropTypes.number,
        //onTripFormUpdateCallback(updateTripInfo):
        //  updateTripInfo is an object containing a name, country, state, location, year, or month property
        onTripFormUpdateCallback: PropTypes.func.isRequired
    };

    onTripFormUpdate = (updatedStuff) => {
        this.props.onTripFormUpdateCallback(updatedStuff);
    }

    render() {
        return (
            <form>
                    <Row className="show-grid">
                        <Col xs={12} md={8}>
                            <FormGroup
                                controlId="nameFormInput"
                                validationState={validateFormString(this.props.name)}
                            >
                                <label className="has-float-label">
                                    <FormControl
                                        type="text"
                                        value={this.props.name || ''}
                                        placeholder="Enter text"
                                        onChange={(e) => {
                                            this.onTripFormUpdate({
                                                name: e.target.value
                                            });
                                        }}
                                    />
                                    <span>Name</span>
                                </label>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col xs={12} md={8}>
                            <FormGroup
                                controlId="locationFormInput"
                                validationState={validateFormString(this.props.location)}
                            >
                                <label className="has-float-label">
                                    <FormControl
                                        type="text"
                                        value={this.props.location || ''}
                                        placeholder="Enter text"
                                        onChange={(e) => {
                                            this.onTripFormUpdate({
                                                location: e.target.value
                                            });
                                        }}
                                    />
                                    <span>Location</span>
                                </label>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col xs={12} md={4}>
                            <FormGroup
                                controlId="countryFormInput"
                            >
                                <label className="has-float-label">
                                    <FormControl
                                        type="text"
                                        value={this.props.country || ''}
                                        placeholder="Country"
                                        onChange={(e) => {
                                            this.onTripFormUpdate({
                                                country: e.target.value
                                            });
                                        }}
                                    />
                                    <span>Country</span>
                                </label>
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={4}>
                            <FormGroup
                                controlId="stateFormInput"
                            >
                                <label className="has-float-label">
                                    <FormControl
                                        type="text"
                                        value={this.props.state || ''}
                                        placeholder="Enter text"
                                        onChange={(e) => {
                                            this.onTripFormUpdate({
                                                state: e.target.value
                                            });
                                        }}
                                    />
                                    <span>State/Region</span>
                                </label>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row className="show-grid">
                        <Col xs={12} md={4}>
                            <FormGroup
                                controlId="yearFormInput"
                                validationState={validateFormPositiveNumber(this.props.year)}
                            >
                                <label className="has-float-label">
                                    <FormControl
                                        type="text"
                                        value={this.props.year || ''}
                                        placeholder="Enter text"
                                        onChange={(e) => {
                                            this.onTripFormUpdate({
                                                year: e.target.value
                                            });
                                        }}
                                    />
                                    <span>Year</span>
                                </label>
                            </FormGroup>
                        </Col>
                        <Col xs={12} md={4}>
                            <Form.Group controlId="TripForm_monthFormGroup"
                                    validationState={validateFormPositiveNumber(this.props.month)}
                            >
                                <Form.Control as="select">
                                    {MONTHS.map(this.renderMonthsOptions)}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

            </form>
        );
    }
}