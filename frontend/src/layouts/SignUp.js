import { Button, Form, Row } from 'react-bootstrap';
import { useIntl, FormattedMessage } from "react-intl";
import axios from "axios";
import { useState } from 'react';
import { useHistory } from "react-router-dom";
import * as Yup from 'yup';
import { Formik } from 'formik';
import FormField from "../components/FormField";


const SignUp = () => {
    const history = useHistory();
    const intl = useIntl();
    const [ loading, setLoading ] = useState(false);
    const initialValues = {
        name: "",
        email: "",
        userName: "",
        password: "",
        passwordConfirmation: ""
    }
    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3)
            .max(100)
            .required(intl.formatMessage({ id: "validations.required" })),
        userName: Yup.string()
            .min(3)
            .max(50)
            .required(intl.formatMessage({ id: "validations.required" }))
            .matches(/^([a-z0-9\_]*)$/i, intl.formatMessage({ id: "validation.userNameFormat" })),
        email: Yup.string()
            .max(75)
            .email(intl.formatMessage({ id: "validations.invalidEmail" }))
            .required(intl.formatMessage({ id: "validations.required" })),
        password: Yup.string()
            .min(8)
            .max(60)
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?& ]{8,60}$/,
                intl.formatMessage({ id: "validation.passwordFormat"})
            )
            .required(intl.formatMessage({ id: "validations.required" })),
        passwordConfirmation: Yup.string()
            .required(intl.formatMessage({ id: "validations.required" }))
            .oneOf([Yup.ref("password"), null], intl.formatMessage({ id: "validations.passwordMatch" }))

    });
    const signUpSubmit = (values) => {
        setLoading(true);
        const submitPayload = {
            name: values.name,
            email: values.email,
            userName: values.userName,
            password: values.password,
        }

        axios.post("/api/users/signup", submitPayload).then(() => {
            history.push("/login");
        }).catch((err) => {
            console.log(err);
        }).finally(() => setTimeout(() => setLoading(false), 5000));
    }

    return(
        <Row className="align-self-center" style={{ marginTop: "50px" }}>
            <Formik validateOnChange={false} validationSchema={validationSchema} onSubmit={signUpSubmit} initialValues={initialValues}>
                {({ errors, handleSubmit, values, handleChange }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <h2><FormattedMessage id='signup.title' /></h2>
                        <fieldset disabled={loading}>
                            <FormField name="name" label="Nome" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="email" label="E-mail" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="userName" label="Nome de usuário" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="password" password label="Senha" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="passwordConfirmation" password label="Confirmação de senha" onChange={handleChange} errors={errors} values={values} />
                            <Form.Group className="mb-3">
                                <Button type="submit"><FormattedMessage id="signup.submitButton" /></Button>
                            </Form.Group>
                        </fieldset>
                    </Form>
                )}
            </Formik>
        </Row>
    )
}

export default SignUp;