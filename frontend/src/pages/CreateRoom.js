import React, { useState, Fragment, useEffect, Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loading from "../components/Loading";
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
            name: Yup.string()
            .when("userNotLoggedIn", {
                is: cookies.userName == "",
                then: Yup
                    .string()
                    .min(3, t({ id: "validations.minChar" }, { qty: 3 }))
                    .max(100, t({ id: "validations.maxChar" }, { qty: 100 }))
                    .required(t({ id: "validations.required" })),
            }),
            roomName: Yup.string()
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
            name: "",
            roomName: "",
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
        axios.post("/api/users/", { userName: userName }).then((err, res) => {
            cookies.set("user_guest_name", userName);
        }).finally(() => {
            this.setState({"loading": false});
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { cookies, history } = this.props;
        const { roomName, maxValue, includeCoffeeCard, includeUnknownCard } = this.state;

        this.setState({"loading": true});
        const userName = cookies.get('user_guest_name');
        axios.post("/api/rooms/", { roomName, maxValue, includeUnknownCard, includeCoffeeCard, owner: userName }).then((res) => {
            const roomUri = res.data;
            history.push(`/room/${roomUri}`)
        }).catch(() => {
            history.push(`/error`)
        }).finally(() => {
            this.setState({"loading": false});
        })
    }

    render(){
        const { cookies, intl } = this.props;
        const { loading } = this.state;
        console.log(this.props.cookies);
        
        if(loading)
            return <Loading />

        return <Formik validateOnChange={false} initialValues={this.initialValues}>
                {({ errors, handleBlur, handleSubmit, touched, values, handleChange }) => (
                    <Form onSubmit={ handleSubmit }>
                        <fieldset>
                            { cookies.userName == "" && <Form.Group className="mb-3">
                                <Form.Label><FormattedMessage id='createRoom.userName' /></Form.Label>
                                <Form.Control type="text" name="userName" />
                            </Form.Group> }
                            <Form.Group className="mb-3">
                                <Form.Label><FormattedMessage id='createRoom.roomName' /></Form.Label>
                                <Form.Control type="text" name="roomName" />
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
                )}                
        </Formik>;
    }
}

export default withRouter(withCookies(injectIntl(CreateRoom)));