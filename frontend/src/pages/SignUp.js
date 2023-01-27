import { Button, Form, Col } from 'react-bootstrap';
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
            .matches(/^([a-z0-9\_]*)$/i, t({ id: "validations.userNameFormat" }))
            .test("checkUserNameUnique", t({ id: "validations.userNameInUse" }), (value) => {
                if(value){
                    return new Promise((resolve, reject) => {
                        axios.post("/api/users/checkUserName", { userName: value })
                            .then(() => resolve(true) )
                            .catch(() => resolve(false))
                    });
                }
            }),
        email: Yup.string()
            .required(t({ id: "validations.required" }))
            .max(75, t({ id: "validations.maxChar" }, { qty: 75 }))
            .email(t({ id: "validations.invalidEmail" }))
            .test("checkEmailUnique", t({ id: "validations.emailInUse" }), (value) => {
                if(value){
                    return new Promise((resolve, reject) => {
                        axios.post("/api/users/checkEmail", { email: value }).then((res) => {
                            resolve(res.status == 200)
                        }).catch((err) => {
                            resolve(false);
                        })
                    });
                }
            }),
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
            console.error(err);
        }).finally(() => setLoading(false));
    }

    return(
        <Col className="align-self-center">
            <Formik validateOnChange={false} validationSchema={validationSchema} onSubmit={signUpSubmit} initialValues={initialValues}>
                {({ errors, handleBlur, handleSubmit, touched, values, handleChange }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <h2><FormattedMessage id='signup.title' /></h2>
                        <fieldset disabled={loading}>
                            <FormField name="name" label={t({ id: "signup.name" })} onBlur={handleBlur} onChange={handleChange} errors={errors} values={values} touched={touched} />
                            <FormField name="email" label={t({ id: "signup.email" })} onBlur={handleBlur} onChange={handleChange} errors={errors} values={values} touched={touched} />
                            <FormField name="userName" label={t({ id: "signup.userName" })} onBlur={handleBlur} onChange={handleChange} errors={errors} values={values} touched={touched} />
                            <FormField name="password" password label={t({ id: "signup.password" })} onBlur={handleBlur} onChange={handleChange} errors={errors} values={values} touched={touched} />
                            <FormField name="passwordConfirmation" password label={t({ id: "signup.passwordConfirmation" })} onBlur={handleBlur} onChange={handleChange} errors={errors} values={values} touched={touched} />
                            <Form.Group className="mb-3">
                                <Button type="submit"><FormattedMessage id="signup.submitButton" /></Button>
                            </Form.Group>
                        </fieldset>
                    </Form>
                )}
            </Formik>
        </Col>
    )
}

export default SignUp;