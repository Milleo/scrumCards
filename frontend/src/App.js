import React, { useEffect, useState } from 'react';
import { IntlProvider } from 'react-intl';
import { enTranslations, ptBrTranslations } from "./i18n";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './themes/theme';
import { GlobalStyles } from './themes/global';
import { Header } from "./components";
import Container from 'react-bootstrap/Container';
import { CreateRoom, Login, Main, Room, SignUp, NoMatch } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';


function App(){
    let userLang = (navigator.language || navigator.userLanguage).toLowerCase(); 
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState(userLang);
    const [translations, setTranslations] = useState(enTranslations);
    const onChangeLang = (e, { target }) => setLanguage(target.dataset.country);
    const toggleTheme = () => {
        if(theme === "light"){
            setTheme("dark");
        }else{
            setTheme("light");
        }
    }
    
    useEffect(() => {
        if(language == "pt-br")
            setTranslations(ptBrTranslations);
        else   
            setTranslations(enTranslations);
    }, [language])

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
                                    <Route path="/login"><Login /></Route>
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