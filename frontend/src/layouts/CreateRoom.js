import React, { useState, Fragment, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { FormattedMessage, useIntl } from "react-intl";
import axios from "axios";
import { useCookies } from 'react-cookie';
import faker from "faker";
import { useHistory } from "react-router-dom";


function CreateRoom(){
    const intl = useIntl();
    const fibonnaciValues = [1,2,3,5,8,13,21,40,100];
    const [ maxValue, setMaxValue ] = useState(fibonnaciValues.length - 1);
    const [ roomName, setRoomName ] = useState("");
    const [ loading, setLoading ] = useState(true);
    const [ includeUnknownCard, setIncludeUnknownCard ] = useState(false);
    const [ includeCoffeeCard, setIncludeCoffeeCard ] = useState(false);
    const [ scrumCardsCookie, setScrumCardsCookie, removeScrumCardsCookie ] = useCookies('scrum_cards');
    const history = useHistory();

    const handleChangeMaxValue = (e) => setMaxValue(e.target.value);
    const handleRoomName = (e) => setRoomName(e.target.value);
    const handleChangeUnknownCard = (e) => setIncludeUnknownCard(e.target.checked); 
    const handleChangeCoffeeCard = (e) => setIncludeCoffeeCard(e.target.checked);

    useEffect(() => {
        if(!("user_guest_name" in scrumCardsCookie)){
            const userNameSufix = faker.random.alphaNumeric(8);
            const userName = `guest_${userNameSufix}`;
            axios.post("/api/users", { userName: userName }).then((err, res) => {
                setScrumCardsCookie("user_guest_name", userName);
                setLoading(false);
            })
        }else{
            const userName = scrumCardsCookie['user_guest_name'];
            axios.get("/api/users/", { name: userName }).then((err, res) => {
                setLoading(false);
            }).catch(() => {
                removeScrumCardsCookie("user_guest_name");
                setLoading(false);
                setLoading(true);
            })
            
        }
    }, [loading]);

    const handleSubmit = function(e){
        e.preventDefault();

        setLoading(true);

        axios.post("/api/rooms", { roomName, maxValue, includeUnknownCard, includeCoffeeCard, owner: scrumCardsCookie['user_guest_name'] }).then((res) => {
            const roomUri = res.data;
            history.push(`/room/${roomUri}`)
        });
    }

    return (
        <Fragment>
            { loading && <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner> }

            { !loading && <Form onSubmit={ handleSubmit }>
                <Form.Group>
                    <Form.Label><FormattedMessage id='createRoom.roomName' /></Form.Label>
                    <Form.Control type="text" name="roomName" onChange={ handleRoomName } />
                    <Form.Label><FormattedMessage id='createRoom.maxValue' />: { fibonnaciValues[maxValue] }</Form.Label>
                    <Form.Range onChange={ handleChangeMaxValue } min="1" max={fibonnaciValues.length - 1} step="1" value={maxValue} />
                    <Form.Check onChange={ handleChangeUnknownCard } name="includeUnknownCard"  type="switch" label={ intl.formatMessage({ id: "createRoom.includeUnknownCard" })} />
                    <Form.Check onChange={ handleChangeCoffeeCard } name="includeCoffeeCard"  type="switch" label={ intl.formatMessage({ id: "createRoom.includeCoffeeCard" })} />
                </Form.Group>
                <Button type="submit"><FormattedMessage id='createRoom.createNewRoom' /></Button>
            </Form> }
        </Fragment>
    );
}

export default CreateRoom;