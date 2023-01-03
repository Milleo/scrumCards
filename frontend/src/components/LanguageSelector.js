import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";

const LanguageSelector = (props) => {
    const { selectedLanguage, onChangeLang } = props;
    const countries = {"pt-br" : "Português", "es": "Español", "en": "English"};

    return <NavDropdown align="end" onSelect={onChangeLang} title={<Image src={`/images/${selectedLanguage}.svg`} width="24" roundedCircle />}>
        { Object.entries(countries).map(([code, country]) => {
            return <NavDropdown.Item data-country={code} key={code}><Image src={`/images/${code}.svg`} width="24" roundedCircle /> {country}</NavDropdown.Item>
        })}
    </NavDropdown>;
}

export default LanguageSelector;