import React, { Component } from "react";
import { Button, Col, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import faker from "faker";
import { withCookies } from 'react-cookie';
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";
import { Formik } from 'formik';
import * as Yup from 'yup';

class CreateRoom extends Component{
    constructor(props){
        super(props);

        const { cookies } = props;
        const t = props.intl.formatMessage;
        this.fibonacci = [1,2,3,5,8,13,21,34,55,89];
        this.validationSchema = Yup.object().shape({
            userName: Yup.string()
            .when("userNotLoggedIn", {
                is: (cookies.userName == "" || !("userName" in cookies)),
                then: Yup
                    .string()
                    .min(3, t({ id: "validations.minChar" }, { qty: 3 }))
                    .max(100, t({ id: "validations.maxChar" }, { qty: 100 }))
                    .required(t({ id: "validations.required" })),
            }),
            name: Yup.string()
                .required(t({ id: "validations.required" }))
                .max(50, t({ id: "validations.maxChar" }, { qty: 75 })),
            maxValue: Yup.number().integer()
                .min(2)
                .max(89)
                .required(t({ id: "validations.required" })),
            includeUnknownCard: Yup.bool(),
            includeCoffeeCard: Yup.bool(),
        });

        this.initialValues = {
            userName: "",
            name: "",
            maxValue: 6,
            includeUnknownCard: false,
            includeCoffeeCard: false
        };

        this.state = { loading: false };
    }

    
    createGuestUser = () => {
        const { cookies } = this.props;
        const userNameSufix = faker.random.alphaNumeric(8);
        const userName = `guest_${userNameSufix}`;
        return axios.post("/api/users/guest/", { userName: userName }).then((err, res) => {
            cookies.set("user_guest_name", userName);
        }).finally(() => {
            this.setState({"loading": false});
        })
    }

    submitForm = async (values) => {
        this.setState({"loading": true});
        const { cookies } = this.props;

        if(cookies.userName == "" || !("userName" in cookies)){
            await this.createGuestUser(values);
        }

        const { history } = this.props;
        const { name, maxValue, includeCoffeeCard, includeUnknownCard } = values;
        const roomCreationPayload =  {
            name,
            maxValue: this.fibonacci[maxValue],
            includeUnknownCard,
            includeCoffeeCard
        };
        
        axios.post("/api/rooms/", roomCreationPayload).then((res) => {
            const { uri } = res.data;
            history.push(`/room/${uri}`);
        }).catch(() => {
            history.push(`/error`)
        }).finally(() => {
            this.setState({"loading": false});
        });
    }

    render(){
        const { cookies, intl } = this.props;
        const { loading } = this.state;
        
        if(loading)
            return <Spinner />

        return <Formik validateOnChange={false} validationSchema={this.validationSchema} initialValues={this.initialValues} onSubmit={this.submitForm}>
                {({ errors, handleBlur, handleSubmit, touched, values, handleChange }) => (
                    <Col>
                        <Form onSubmit={ handleSubmit }>
                            <fieldset disabled={loading}>
                            { (cookies.userName == "" || !("userName" in cookies)) && <Form.Group className="mb-3">
                                <Form.Label><FormattedMessage id='createRoom.userName' /></Form.Label>
                                <Form.Control
                                    type="text"
                                    isInvalid={!!errors["userName"] && !!touched["userName"]}
                                    onChange={ handleChange }
                                    value={ values.userName }
                                    name="userName" />
                                <Form.Control.Feedback type="invalid">{errors["userName"]}</Form.Control.Feedback>
                            </Form.Group> }
                            <Form.Group className="mb-3">
                                <Form.Label><FormattedMessage id='createRoom.roomName' /></Form.Label>
                                <Form.Control
                                    onChange={ handleChange }
                                    value={ values.name }
                                    isInvalid={!!errors["name"] && !!touched["name"]}
                                    type="text"
                                    name="name" />
                                <Form.Control.Feedback type="invalid">{errors["name"]}</Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label><FormattedMessage id='createRoom.maxValue' />: { this.fibonacci[values.maxValue] }</Form.Label>
                                <Form.Range onChange={ handleChange } name="maxValue" min="2" max={ this.fibonacci.length - 1 } step="1" value={values.maxValue} />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Check name="includeUnknownCard"  type="switch" label={ intl.formatMessage({ id: "createRoom.includeUnknownCard" })} />
                                <Form.Check name="includeCoffeeCard"  type="switch" label={ intl.formatMessage({ id: "createRoom.includeCoffeeCard" })} />
                            </Form.Group>
                            <Button type="submit"><FormattedMessage id='createRoom.createNewRoom' /></Button>
                            </fieldset>
                        </Form>
                    </Col>
                )}                
        </Formik>;
    }
}

export default withRouter(withCookies(injectIntl(CreateRoom)));