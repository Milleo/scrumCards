import Form from "react-bootstrap/Form";
import "./ThemeSwitch.css";

function ThemeSwitch(props){
    return (
        <Form.Check onClick={props.toggleTheme} type="switch" id="theme-switch" />
    )
}

export default ThemeSwitch;