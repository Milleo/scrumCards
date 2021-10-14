import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "react-bootstrap/Image";

function LanguageSelector(props){
    const { selectedLanguage, onChangeLang } = props;
    const countries = [ "pt-br", "es", "en" ];

    return <NavDropdown onSelect={onChangeLang} title={<Image src={`/images/${selectedLanguage}.svg`} width="24" roundedCircle />}>
        { countries.map(function(country){
            return <NavDropdown.Item key={country}><Image data-country={country} src={`/images/${country}.svg`} width="24" roundedCircle /></NavDropdown.Item>
        })}
    </NavDropdown>;
}

export default LanguageSelector;