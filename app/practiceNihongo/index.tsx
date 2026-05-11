import { useMemo } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import FooterBar from "~/infra/footerBar";
import ROUTES from "~/consts/ROUTES";

export default function HomePage() {


  return (
    <div className="homePage" >
      <Container fluid className="homePage_aboutJeff">
        <Row>
          <Col xs={6}>
          </Col>
          <Col xs={6}>
          </Col>
        </Row>
      </Container>
    </div>
  );
}