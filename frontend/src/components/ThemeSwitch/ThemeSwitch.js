import Form from "react-bootstrap/Form";
import { useIntl } from "react-intl";
import "./ThemeSwitch.css";

function ThemeSwitch(props){
    const intl = useIntl();
    return (
        <Form.Check onClick={props.toggleTheme} type="switch" id="theme-switch" />
    )
}

export default ThemeSwitch;