import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import translations from "./i18n/pt-br/translations";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './themes/theme';
import { GlobalStyles } from './themes/global';
import { Header } from "./components";
import Container from 'react-bootstrap/Container';
import CreateRoom from './pages/CreateRoom';
import Main from "./pages/Main";
import Room from "./pages/Room";
import SignUp from "./pages/SignUp";
import NoMatch from "./pages/NoMatch";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';


function App(){
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('pt-br');

    const toggleTheme = () => {
        if(theme === "light"){
            setTheme("dark");
        }else{
            setTheme("light");
        }
    }

    const onChangeLang = (e, { target }) => {
        setLanguage(target.dataset.country);
    }

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <CookiesProvider>
                <GlobalStyles />
                <IntlProvider messages={translations} locale={language} defaultLocale="en">
                    <Router>
                        <Container fluid style={{ height: "100vh" }}>
                            <Header selectedLanguage={language} onChangeLang={ onChangeLang } toggleTheme={ toggleTheme } />
                            <Container>
                                <Switch>
                                    <Route exact path="/"><Main /></Route>
                                    <Route path="/newRoom"><CreateRoom /></Route>
                                    <Route path="/room/:roomURI"><Room /></Route>
                                    <Route path="/signup"><SignUp /></Route>
                                    <Route path="*"><NoMatch /></Route>
                                </Switch>
                            </Container>
                        </Container>
                    </Router>
                </IntlProvider>
            </CookiesProvider>
        </ThemeProvider>
    );
}

export default App;