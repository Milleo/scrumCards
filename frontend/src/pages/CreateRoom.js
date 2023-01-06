import React, { useState, Fragment, useEffect, Component } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loading from "../components/Loading";
import axios from "axios";
import faker from "faker";
import { withCookies } from 'react-cookie';
import { FormattedMessage, injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";


class CreateRoom extends Component{
    constructor(props){
        super(props);

        this.fibonacci = [1,2,3,5,8,13,21,34,55,89];

        this.state = {
            includeUnknownCard: false,
            includeCoffeeCard: false,
            loading: true,
            maxValue: (this.fibonacci.length - 1),
            roomName: "",
        }
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

    componentDidMount(){
        const { cookies } = this.props;
        const scrumCardsCookie = cookies.get("user_guest_name") || null;
        if(scrumCardsCookie != null){
            this.createGuestUser();
        }else{
            const userName = scrumCardsCookie;
            axios.get("/api/users/", { name: userName }).then((data) => {
                if(data == undefined){
                    cookies.remove("user_guest_name", null);
                    this.createGuestUser();
                }
            }).catch(() => {
                cookies.remove("user_guest_name", null);
            }).finally(() => {
                this.setState({"loading": false});
            })
        }
    }

    handleChangeMaxValue = (e) => this.setState({ "maxValue": e.target.value});
    handleRoomName = (e) => this.setState({ "roomName": e.target.value});
    handleChangeUnknownCard = (e) => this.setState({ "includeUnknownCard": e.target.checked});
    handleChangeCoffeeCard = (e) => this.setState({ "includeCoffeeCard": e.target.checked});
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
        const { intl } = this.props;
        const { loading, maxValue } = this.state;
        
        if(loading)
            return <Loading />

        return <Form onSubmit={ this.handleSubmit }>
            <Form.Group>
                <Form.Label><FormattedMessage id='createRoom.roomName' /></Form.Label>
                <Form.Control type="text" name="roomName" onChange={ this.handleRoomName } />
                <Form.Label><FormattedMessage id='createRoom.maxValue' />: { this.fibonacci[maxValue] }</Form.Label>
                <Form.Range onChange={ this.handleChangeMaxValue } min="1" max={ this.fibonacci.length - 1 } step="1" value={maxValue} />
                <Form.Check onChange={ this.handleChangeUnknownCard } name="includeUnknownCard"  type="switch" label={ intl.formatMessage({ id: "createRoom.includeUnknownCard" })} />
                <Form.Check onChange={ this.handleChangeCoffeeCard } name="includeCoffeeCard"  type="switch" label={ intl.formatMessage({ id: "createRoom.includeCoffeeCard" })} />
            </Form.Group>
            <Button type="submit"><FormattedMessage id='createRoom.createNewRoom' /></Button>
        </Form>;
    }
}

export default withRouter(withCookies(injectIntl(CreateRoom)));