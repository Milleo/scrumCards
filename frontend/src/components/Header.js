import { LanguageSelector, ThemeSwitch } from "../components";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Button, Col, Container, Nav, Navbar, Row } from "react-bootstrap";

const Header = (props) => {
    return(
        <Navbar>
            <Container>
                <Row>
                    <Col xs="12" className="d-flex justify-content-between">
                        <Navbar.Brand><Link to="/"><span>♠</span> ScrumCards</Link></Navbar.Brand>
                            
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Nav>
                            <ThemeSwitch toggleTheme={ props.toggleTheme } />
                            <LanguageSelector selectedLanguage={props.selectedLanguage} onChangeLang={props.onChangeLang}  />
                        </Nav>
                    </Col>
                    <Col xs="12" className="d-flex justify-content-end">
                        <Link to="/login" component={Button} size="sm" variant="secondary" style={{ marginRight: "10px" }}><FormattedMessage id="main.login" /></Link>
                        <Link to="/signup" component={Button} size="sm" variant="primary"><FormattedMessage id="main.signup" /></Link>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}

export default Header;