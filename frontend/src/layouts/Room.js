import React, { Fragment, useState } from "react";
import { Card } from "../components";
import { useParams } from "react-router-dom"
import axios from "axios";
import { useHistory } from "react-router-dom";

function Room(props){
    const {roomURI} = useParams();
    const history = useHistory();
    const [ loading, setLoading ] = useState(false);
    const [ roomData, setRoomData ] = useState({});

    axios.get(`/api/rooms/${roomURI}`).then((res) => {
        setLoading(false);
        console.log(res);
        setRoomData(res.data);
    }).catch(() => {
        history.push("/404");
    })

    return <Fragment><h1>{roomData.name}</h1>
        <Card />
    </Fragment>
}

export default Room;