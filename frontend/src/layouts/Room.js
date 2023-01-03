import React, { Fragment, useEffect, useState } from "react";
import { Card } from "../components";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import io from 'socket.io-client';

function Room(props){
    const {roomURI} = useParams();
    const history = useHistory();
    const [ loading, setLoading ] = useState(false);
    const [ roomData, setRoomData ] = useState({});
    const socket = io();
    const [ userCount, setUserCount ] = useState(0);

    useEffect(() => {
        axios.get(`/api/rooms/${roomURI}`).then((res) => {
            setLoading(false);
            setRoomData(res.data);
        }).catch(() => {
            history.push("/404");
        });

        socket.on("welcome", (data) => {
            console.log(data);
        })

        return () => {
            socket.off('TESTE');
            socket.off('welcome');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);
    

    return <Fragment><h1>{roomData.name}</h1>
        {userCount}
        <Card />
    </Fragment>
}

export default Room;