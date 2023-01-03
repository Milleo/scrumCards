import Row from 'react-bootstrap/Row';
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";


function Main(){
    return(
        <Row className="align-self-center" style={{ marginTop: "50px" }}>
            <h2><FormattedMessage id='main.title' /></h2>
            <p><FormattedMessage id='main.welcomeMessage' /></p>
            <Link className="btn btn-primary" to="/newRoom">Criar uma sala</Link>
        </Row>
    )
}

export default Main;