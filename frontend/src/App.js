    import React, { useState } from 'react';
import { IntlProvider } from 'react-intl';
import translations from "./i18n/pt_br/translations";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './themes/theme';
import { GlobalStyles } from './themes/global';
import { Header } from "./components";
import Container from 'react-bootstrap/Container';
import CreateRoom from './layouts/CreateRoom';
import Main from "./layouts/Main";
import Room from "./layouts/Room";
import NoMatch from "./layouts/NoMatch";
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

    const onChangeLang = (e, event) => {
        setLanguage(event.target.dataset.country);
    }

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <CookiesProvider>
                <GlobalStyles />
                <IntlProvider messages={translations} locale={language} defaultLocale="en">
                    <Router>
                        <Header selectedLanguage={language} onChangeLang={ onChangeLang } toggleTheme={ toggleTheme } />
                        <Container fluid>
                            <Switch>
                                <Route exact path="/"><Main /></Route>
                                <Route path="/newRoom"><CreateRoom /></Route>
                                <Route path="/room/:roomURI"><Room /></Route>
                                <Route path="*"><NoMatch /></Route>
                            </Switch>
                        </Container>
                    </Router>
                </IntlProvider>
            </CookiesProvider>
        </ThemeProvider>
    );
}

export default App;