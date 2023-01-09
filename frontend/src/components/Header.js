import { LanguageSelector, ThemeSwitch } from "../components";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Button, Col, Container, Nav, Navbar, Row } from "react-bootstrap";

const Header = (props) => {
    const { onLogout, user } = props;
    
    return(
        <Navbar>
            <Container>
                <Row>
                    <Col xs="6" md="6" className="d-flex justify-content-between">
                        <Navbar.Brand><Link to="/"><span>♠</span> ScrumCards</Link></Navbar.Brand>
                    </Col>
                    <Col xs="6" md="4" className="d-flex justify-content-end">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Nav>
                            <ThemeSwitch toggleTheme={ props.toggleTheme } />
                            <LanguageSelector selectedLanguage={props.selectedLanguage} onChangeLang={props.onChangeLang}  />
                        </Nav>
                    </Col>
                    { user.userName == "" && <Col xs="12" md="2" className="d-flex justify-content-end">
                        <Link to="/login" className="btn btn-secondary btn-sm" style={{ marginRight: "10px" }}><FormattedMessage id="main.login" /></Link>
                        <Link to="/signup" className="btn btn-primary btn-sm" ><FormattedMessage id="main.signup" /></Link>
                    </Col> }
                    { user.userName != "" && <Col xs="12" className="d-flex justify-content-end">
                        { user.userName } | <Button variant="link" onClick={onLogout}>Logout</Button>
                    </Col> }
                </Row>
            </Container>
        </Navbar>
    )
}

export default Header;