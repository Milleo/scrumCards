import { Button, Form, Row } from 'react-bootstrap';
import { useIntl, FormattedMessage } from "react-intl";
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import FormField from "../components/FormField";
import { Link } from 'react-router-dom';

const Login = () => {
    const t = useIntl().formatMessage;
    const [ loading, setLoading ] = useState(false);
    const initialValues = { lgoin: "", password: "" };
    const validationSchema = Yup.object().shape({
        login: Yup.string().required(t({ id: "validations.required" })),
        password: Yup.string().required(t({ id: "validations.required" })),
    });
    return <Row className="align-self-center" style={{ marginTop: "50px" }}>
        <Formik validateOnChange={false} validationSchema={validationSchema} onSubmit={() => console.log(true)} initialValues={initialValues}>
            {({ errors, handleBlur, handleSubmit, touched, values, handleChange }) => (
                <Form noValidate onSubmit={handleSubmit}>
                    <h2><FormattedMessage id='login.title' /></h2>
                    <fieldset disabled={loading}>
                        <FormField name="login" label={t({ id: "login.loginField" })} onBlur={handleBlur} onChange={handleChange} errors={errors} values={values} touched={touched} />
                        <FormField name="password" password label={t({ id: "login.passwordField" })} onBlur={handleBlur} onChange={handleChange} errors={errors} values={values} touched={touched} />
                        <Form.Group className="d-flex mb-3 justify-content-between align-items-center">
                            <Button type="submit"><FormattedMessage id="login.submitButton" /></Button>
                            <Link to="/forgotPassword"><FormattedMessage id="login.forgotPassword" /></Link>
                        </Form.Group>
                    </fieldset>
                </Form>
            )}
        </Formik>
    </Row>
}

export default Login;