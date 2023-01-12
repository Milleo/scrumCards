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
import { BrowserRouter as Router, Switch, Route, Redirect, useHistory } from "react-router-dom";
import { useCookies } from 'react-cookie';
import axios from "axios";

function App(){
    let userLang = (navigator.language || navigator.userLanguage).toLowerCase(); 
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState(userLang);
    const [translations, setTranslations] = useState(enTranslations);
    const [user, setUser] = useState({ auth: false, name: "", userName: "", email: "" });
    const [ cookies, setCookie, removeCookie ] = useCookies(["scrum_cards"]);
    const history = useHistory();

    const handleChangeLang = (e, { target }) => setLanguage(target.dataset.country);
    const handleLogin = (data) => {
        setUser({
            name: data.name,
            userName: data.userName,
            email: data.email
        });
        setCookie("userName", data.userName, {
            expires: new Date(Date.now() + 16 * 3600000),
            sameSite: "strict"
        });
    }
    const handleLogout = () => {
        setUser({ auth: false, name: "", userName: "", email: "" });
        removeCookie("userName");
    }
    const toggleTheme = () => {
        if(theme === "light"){
            setTheme("dark");
        }else{
            setTheme("light");
        }
    }
    
    useEffect(() => {
        if(user.userName == "" && cookies.userName != ""){
            axios.get(`/api/users/${cookies.userName}`)
            .then((res) => {
                setUser({
                    name: res.data.name,
                    userName: res.data.userName,
                    email: res.data.email
                });
            });
        }
    }, [])
    useEffect(() => {
        if(language == "pt-br")
            setTranslations(ptBrTranslations);
        else   
            setTranslations(enTranslations);
    }, [language])

    return (
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
            <GlobalStyles />
            <IntlProvider messages={translations} locale={language} defaultLocale="en">
                <Router>
                    <div style={{ height: "100vh" }}>
                        <Header
                            onLogout={ handleLogout }
                            onChangeLang={ handleChangeLang }
                            selectedLanguage={ language }
                            toggleTheme={ toggleTheme }
                            user={ user } />
                        <Container>
                            <Switch>
                                <Route exact path="/"><Main /></Route>
                                <Route path="/newRoom"><CreateRoom /></Route>
                                <Route path="/room/:roomURI"><Room /></Route>
                                <Route path="/signup"><SignUp /></Route>
                                { (user.userName != "")?<Redirect to="/" />:<Route path="/login"><Login onLogin={handleLogin} /></Route> }
                                <Route path="*"><NoMatch /></Route>
                            </Switch>
                        </Container>
                    </div>
                </Router>
            </IntlProvider>
        </ThemeProvider>
    );
}

export default App;