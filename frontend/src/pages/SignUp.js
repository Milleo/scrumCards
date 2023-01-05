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
    const t = useIntl().formatMessage;
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
            .min(3, t({ id: "validations.minChar" }, { qty: 3 }))
            .max(100, t({ id: "validations.maxChar" }, { qty: 100 }))
            .required(t({ id: "validations.required" })),
        userName: Yup.string()
            .min(3, t({ id: "validations.minChar" }, { qty: 3 }))
            .max(50, t({ id: "validations.maxChar" }, { qty: 50 }))
            .required(t({ id: "validations.required" }))
            .matches(/^([a-z0-9\_]*)$/i, t({ id: "validations.userNameFormat" })),
        email: Yup.string()
            .max(75)
            .max(75, t({ id: "validations.maxChar" }, { qty: 75 }))
            .email(t({ id: "validations.invalidEmail" }))
            .required(t({ id: "validations.required" })),
        password: Yup.string()
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?& ]{8,}$/,
                t({ id: "validations.passwordFormat"})
            )
            .required(t({ id: "validations.required" })),
        passwordConfirmation: Yup.string()
            .required(t({ id: "validations.required" }))
            .oneOf([Yup.ref("password"), null], t({ id: "validations.passwordMatch" }))

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
        }).finally(() => setLoading(false));
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
                            <FormField name="password" password label="Password" onChange={handleChange} errors={errors} values={values} />
                            <FormField name="passwordConfirmation" password label="Password confirmation" onChange={handleChange} errors={errors} values={values} />
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