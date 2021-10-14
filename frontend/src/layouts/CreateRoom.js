import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FormattedMessage, useIntl } from "react-intl";
import { useHistory } from "react-router-dom";
import axios from "axios";

function CreateRoom(){
    const intl = useIntl();
    const history = useHistory();
    const fibonnaciValues = [1,2,3,5,8,13,21,40,100];
    const [ maxValue, setMaxValue ] = useState(fibonnaciValues.length - 1);

    const handleChangeMaxValue = function(e, value){
        setMaxValue(e.target.value);
    }

    const handleSubmit = function(e){
        e.preventDefault();
        axios.post("//localhost:1337/rooms/create", (err, res) => {
            console.log(res, err);
        })
    }

    return (
        <Form onSubmit={ handleSubmit }>
            <Form.Group>
                <Form.Label><FormattedMessage id='createRoom.roomName' /></Form.Label>
                <Form.Control type="text" name="roomName" />
                <Form.Label><FormattedMessage id='createRoom.maxValue' />: { fibonnaciValues[maxValue] }</Form.Label>
                <Form.Range onChange={ handleChangeMaxValue } min="1" max={fibonnaciValues.length - 1} step="1" value={maxValue} />
                <Form.Check  type="switch" label={ intl.formatMessage({ id: "createRoom.includeUnknownCard" })} />
                <Form.Check  type="switch" label={ intl.formatMessage({ id: "createRoom.includeCoffeeCard" })} />
            </Form.Group>
            <Button type="submit"><FormattedMessage id='createRoom.createNewRoom' /></Button>
        </Form>
    );
}

export default CreateRoom;