import { Button, Form, Row } from 'react-bootstrap';
import { useIntl, FormattedMessage } from "react-intl";
import { Formik } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';
import axios from "axios";
import FormField from "../components/FormField";
import { Link, useHistory } from 'react-router-dom';

const Login = (props) => {
    const { onLogin } = props;
    const t = useIntl().formatMessage;
    const [ loading, setLoading ] = useState(false);
    const initialValues = { login: "", password: "" };
    const history = useHistory();
    const validationSchema = Yup.object().shape({
        login: Yup.string().required(t({ id: "validations.required" })),
        password: Yup.string().required(t({ id: "validations.required" })),
    });

    const loginSubmit = (values) => {
        setLoading(true);
        const loginPayload = { password: values.password };
        if(values.login.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)){
            loginPayload.email = values.login;
        }else{
            loginPayload.userName = values.login;
        }
        axios.post("/api/users/login", loginPayload)
            .then((res) => {
                const jwtToken = res.headers["x-access-token"];
                localStorage.setItem('jwtToken', jwtToken);
                axios.defaults.headers.common['Authorization'] = 'Bearer'+jwtToken;
                onLogin({
                    name: res.data.name,
                    userName: res.data.userName,
                    email: res.data.email
                });
                history.push("/");
            }).finally(() => {
                setLoading(false);
            })
    }

    return <Row className="align-self-center" style={{ marginTop: "50px" }}>
        <Formik validateOnChange={false} validationSchema={validationSchema} onSubmit={loginSubmit} initialValues={initialValues}>
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