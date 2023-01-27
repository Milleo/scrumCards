import { Card } from "./";
import { useState } from "react";

const CardDeck = () => {
    const fibonacci = [1,2,3,5,8,13,21,34,55,89];
    const [ selectedCard, setSelectedCard ] = useState(null);
    const selectCard = (cardValue) => {
        setSelectedCard(cardValue);
    }

    return <div className="d-flex align-self-end mb-3" style={{ "flexWrap": "wrap" }}>
        { fibonacci.map((value) => <Card
        onClick={selectCard}
        key={`card_value_${value}`}
        selected={value == selectedCard}
        value={value} /> )}
    </div>
}

export default CardDeck;