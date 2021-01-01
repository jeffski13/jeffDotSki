import React, { Component } from 'react';
import { Container, Col, Row, Image } from 'react-bootstrap';
import './styles.css';
import '../AboutMe/Bio/styles.css';

class Ali extends Component {
    render() {
        return (
            <div className="Careers">
                <Container>
                    <Row className="show-grid tinder">
                        <Col sm={4}  />
                        <Col sm={4}  >
                            <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/ali/tinderibarely.png' fluid />
                        </Col>
                        <Col sm={4}  />
                    </Row>
                    <Row className="show-grid">
                        <Col xs={1} >
                        </Col>
                        <Col xs={11} >
                            <div className="aliTitle" >Ali Rundle</div>
                        </Col>
                    </Row>

                    <Row className="show-grid aboutMePargraph">
                        <Col xs={1} />
                        <Col sm={10}  >
                            <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/ali/ali_4.jpg' fluid />
                        </Col>
                        <Col xs={1} />
                    </Row>
                    <Row className="show-grid aboutMePargraph">
                        <Col xs={2} />
                        <Col sm={8} >
                            <h2 className="aboutMeSectionTitle" >Hey there big hunky boys. My name is Ali, but when the lights go off you can call me whatever you want.</h2>
                            <h2 className="aboutMeSectionTitle" >I'm thirsty and I am looking for love. My perfect date: following a riveting round of trivia I will be hot and ready to go. You take me home in your pizza hut delivery car, and I will take you all the way to home base.</h2>
                        </Col>
                        <Col xs={2} />
                    </Row>

                    <Row className="show-grid aboutMePargraph aliSection">
                        <Col xs={1} />
                        <Col sm={10}  >
                            <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/ali/ali_2.jpg' fluid />
                        </Col>
                        <Col xs={1} />
                    </Row>
                    <Row className="show-grid aboutMePargraph">
                        <Col xs={2} />
                        <Col sm={8} >
                            <h2 className="aboutMeSectionTitle" >Muddy? or slutty? I dont mind getting dirty (;</h2>
                        </Col>
                        <Col xs={2} />
                    </Row>

                    <Row className="show-grid aboutMePargraph aliSection">
                        <Col xs={1} />
                        <Col sm={10}  >
                            <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/ali/ali_5.jpg' fluid />
                        </Col>
                        <Col xs={1} />
                    </Row>
                    <Row className="show-grid aboutMePargraph">
                        <Col xs={2} />
                        <Col sm={8} >
                            <h2 className="aboutMeSectionTitle" >They say ima fiesty one.</h2>
                        </Col>
                        <Col xs={2} />
                    </Row>

                    <Row className="show-grid aboutMePargraph aliSection">
                        <Col xs={1} />
                        <Col sm={10}  >
                            <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/ali/ali_6.jpg' fluid />
                        </Col>
                        <Col xs={1} />
                    </Row>
                    <Row className="show-grid aboutMePargraph">
                        <Col xs={2} />
                        <Col sm={8} >
                            <h2 className="aboutMeSectionTitle" >Want to be ridden like a carousel?</h2>
                        </Col>
                        <Col xs={2} />
                    </Row>

                    <Row className="show-grid aboutMePargraph aliSection">
                        <Col xs={1} />
                        <Col sm={10}  >
                            <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/ali/ali_3.jpg' fluid />
                        </Col>
                        <Col xs={1} />
                    </Row>
                    <Row className="show-grid aboutMePargraph">
                        <Col xs={2} />
                        <Col sm={8} >
                            <h2 className="aboutMeSectionTitle" >...or shall I ride you like a roller coaster???</h2>
                        </Col>
                        <Col xs={2} />
                    </Row>

                    <Row className="show-grid aboutMePargraph aliSection">
                        <Col xs={1} />
                        <Col sm={10}  >
                            <Image src='https://s3.us-east-2.amazonaws.com/jeff.ski/aboutme/img/ali/ali_1.jpg' fluid />
                        </Col>
                        <Col xs={1} />
                    </Row>
                    <Row className="show-grid aboutMePargraph">
                        <Col xs={2} />
                        <Col sm={8} >
                            <h2 className="aboutMeSectionTitle" >My face when I found out what he meant by "I'm not afraid to put a ring on it."</h2>
                        </Col>
                        <Col xs={2} />
                    </Row>

                </Container>
            </div>
        );
    }
}

export default Ali;