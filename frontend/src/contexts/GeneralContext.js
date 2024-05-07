import {createContext, useEffect, useState} from "react";

export const GeneralContext = createContext({})


export const GeneralContextProvider = ({children}) => {
    const [countries, setCountries] = useState();
    const [companies, setCompanies] = useState();

    useEffect(() => {
        fetch('http://127.0.0.1:8003/api/get/countries')
            .then(response => response.json())
            .then(data => {setCountries(data)} )
            .catch(err => console.log(err))

        fetch('http://127.0.0.1:8003/api/get/companies')
            .then(response => response.json())
            .then(data => {setCompanies(data)} )
            .catch(err => console.log(err))
    }, []);



    return (
        <GeneralContext.Provider value={{countries, companies}}>
            {children}
        </GeneralContext.Provider>
    );
}