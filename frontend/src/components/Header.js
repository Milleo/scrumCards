import { LanguageSelector, ThemeSwitch } from "../components";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { Button, ButtonGroup, Col, Container, Nav, Navbar, Row } from "react-bootstrap";

const Header = (props) => {
    const { onLogout, user } = props;
    
    return(
        <Navbar className="pt-0">
            <Container>
                <Row>
                    <Col xs="12" md="6" className="d-flex justify-content-center header-brand mb-3">
                        <Navbar.Brand><Link to="/"><span>♠</span> ScrumCards</Link></Navbar.Brand>
                    </Col>
                    <Col xs="6" md="4" className="d-flex">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Nav>
                            <ThemeSwitch toggleTheme={ props.toggleTheme } />
                            <LanguageSelector selectedLanguage={props.selectedLanguage} onChangeLang={props.onChangeLang}  />
                        </Nav>
                    </Col>
                    { user.userName == "" && <Col xs="6" md="2" className="d-flex justify-content-end align-items-center">
                        <ButtonGroup>
                            <Link to="/login" className="btn btn-outline-primary btn-sm"><FormattedMessage id="main.login" /></Link>
                            <Link to="/signup" className="btn btn-primary btn-sm" ><FormattedMessage id="main.signup" /></Link>
                        </ButtonGroup>
                    </Col> }
                    { user.userName != "" && <Col xs="6" className="d-flex justify-content-end align-items-center">
                        <Nav variant="pills">
                            <Nav.Item><Button size="sm" variant="link">{ user.userName }</Button></Nav.Item>
                            <Nav.Item><Button size="sm" variant="outline-primary" onClick={onLogout}>Logout</Button></Nav.Item>
                        </Nav>
                    </Col> }
                    
                </Row>
            </Container>
        </Navbar>
    )
}

export default Header;