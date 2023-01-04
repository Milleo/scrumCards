import { Form } from "react-bootstrap";

const FormField = (props) => {
    const { errors, label, name, onChange, password, values } = props;
    let fieldType = password?"password":"text";
    
    return <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control isInvalid={!!errors[name]} name={name} value={values[name]} onChange={onChange} type={fieldType} />
        <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
}

export default FormField;