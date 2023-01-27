import "./Card.css";

function Card(props){
  const { hidden, onClick, selected, value } = props;
    const cardClass = `card ${hidden === true?'hidden':''} ${selected === true?'selected':''}`;

    return (<div className={cardClass} onClick={() => onClick(value)}>
    <div className="card-inner">
      <div className="card-front"></div>
      <div className="card-back">
        {value}
      </div>
    </div>
  </div>)
}

export default Card;