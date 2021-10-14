import { LanguageSelector, ThemeSwitch } from "../components";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from 'react-bootstrap/Container';
import { Link } from "react-router-dom";

function Header(props){
    return(
        <Navbar>
            <Container>
            <Navbar.Brand><Link to="/"><span>♠</span> ScrumCards</Link></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Nav>
                    <ThemeSwitch toggleTheme={ props.toggleTheme } />
                    <LanguageSelector selectedLanguage={props.selectedLanguage} onChangeLang={props.onChangeLang}  />
                </Nav>
            </Container>
        </Navbar>
    )
}

export default Header;