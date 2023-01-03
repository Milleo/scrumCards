import { Form } from "react-bootstrap";

const FormField = (props) => {
    const { errors, handleChange, label, name, values } = props;

    return <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <Form.Control isInvalid={!!errors[name]} name={name} value={values[name]} onChange={handleChange} type="text" />
        <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
    </Form.Group>
}

export default FormField;