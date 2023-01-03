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
        name: Yup.string().required(intl.formatMessage({ id: "validations.required" })),
        userName: Yup.string().required(intl.formatMessage({ id: "validations.required" })),
        email: Yup.string()
            .email(intl.formatMessage({ id: "validations.invalidEmail" }))
            .required(intl.formatMessage({ id: "validations.required" })),
        password: Yup.string().required(intl.formatMessage({ id: "validations.required" })),
        passwordConfirmation: Yup.string().required(intl.formatMessage({ id: "validations.required" }))
    });
    const signUpSubmit = (values) => {
        console.log(values);
        /*setLoading(true);
        const formData = new FormData(e.target);
        const formDataObj = Object.fromEntries(formData.entries())
        const submitPayload = {
            name: formDataObj.name,
            email: formDataObj.email,
            userName: formDataObj.userName,
            password: formDataObj.password,
        }

        axios.post("/api/users/signup", submitPayload).then(() => {
            history.push("/login");
        }).catch((err) => {
            console.log(err);
        }).finally(() => setLoading(false));*/
    }

    return(
        <Row className="align-self-center" style={{ marginTop: "50px" }}>
            <Formik validationSchema={validationSchema} onSubmit={signUpSubmit} initialValues={initialValues}>
                {({ errors, touched, handleSubmit, values, handleChange }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <>{JSON.stringify(errors)}</>
                        <h2><FormattedMessage id='signup.title' /></h2>
                        <fieldset disabled={loading}>
                            <FormField name="name" label="Nome" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="email" label="E-mail" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="userName" label="Nome de usuário" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="password" label="Senha" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="passwordConfirmation" label="Confirmação de senha" onChange={handleChange} errors={errors} values={values} />
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