import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";


function Main(){
    const intl = useIntl();
    return(
        <Container>
            <Row>
                <h2><FormattedMessage id='main.title' /></h2>
                <p><FormattedMessage id='main.welcomeMessage' /></p>
                <Link className="btn btn-primary" to="/newRoom">Criar uma sala</Link>
            </Row>
        </Container>
    )
}

export default Main;