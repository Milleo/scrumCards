import React, { Fragment, useEffect, useState } from "react";
import { CardDeck } from "../components";
import { useParams, useHistory } from "react-router-dom";
import axios from "axios";
import io from 'socket.io-client';

function Room(){
    const {roomURI} = useParams();
    const history = useHistory();
    const [ loading, setLoading ] = useState(false);
    const [ roomData, setRoomData ] = useState({});
    const [ userCount, setUserCount ] = useState(0);

    useEffect(() => {
        if(roomURI != undefined){
            axios.get(`/api/rooms/${roomURI}`).then((res) => {
                setLoading(false);
                setRoomData(res.data);
            }).catch(() => {
                history.push("/404");
            });
        }
    }, []);
    

    return <Fragment><h1>{roomData.name}</h1>
        <CardDeck />
    </Fragment>
}

export default Room;