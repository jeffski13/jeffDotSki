import React, { Component } from 'react';

import TitleImg from './TitleImg';
import { Row, Col, Image } from 'react-bootstrap';
import './styles.css';

class TitlePage extends Component {
    render() {
        return (
            <div className="TitlePage" >
                <TitleImg />
                <div>
                    <Row className="TitlePage_aboutJeff">
                        <Col sm={4}>
                            <Image src="https://s3.us-east-2.amazonaws.com/jeff.ski/title/titlePage-info1-md.jpg" roundedCircle />
                        </Col>
                        <Col sm={8}>
                            <h3>About Jeff</h3>
                            <ul>
                                <li><strong>Software Engineer:</strong> Web Developer and Android Native Applications</li>
                                <li><strong>Traveler</strong> Tokyo, Japan - Chile Coast - Next Germany? </li>
                                <li><strong>Entrepreneur:</strong> Developing a travel blog platform </li>
                                <li><strong>Passion for Personal Finance:</strong> FI Meetup lead and on the road FI!</li>
                                <li><strong>A Believer of the Arts:</strong> Taking piano lessons, and always singing in the car</li>
                            </ul>
                            {/* <li><strong>AWS Serverless Officionado: </strong> Goodbye server management, hello microservices!</li> */}
                        </Col>
                    </Row>
                </div>
            </div>
        );
    }

}

export default TitlePage;