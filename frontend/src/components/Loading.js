import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";

const Loading = () => {
    return <Row className="justify-content-center align-items-center d-flex flex-column min-vh-100">
        <Col xs="2">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Col>
    </Row>
}

export default Loading;