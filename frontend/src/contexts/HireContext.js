import {createContext, useState} from "react";

export const HireContext = createContext({})

const mockHires = [
    {
        id: 1,
        vacancyId: 1,
        employee: {
            name: "Vasyl",
            surname: "Syman",
            birthDate: "2004-01-14",
            gender: "M",
            email: "vasyl@email.com"
        },
        hireDate: "2024-08-22",
        resume: null,
        resumeUploadDate: null
    },
    {
        id: 2,
        vacancyId: 1,
        employee: {
            name: "Sho",
            surname: "Blia",
            birthDate: "2002-02-03",
            gender: "M",
            email: "vasyl@email.com"
        },
        hireDate: "2025-08-22",
        resume: null,
        resumeUploadDate: null
    }
]

export const HireProvider = ({children}) => {
    const [hires, setHires] = useState(mockHires);
    const [currentHire, setCurrentHire] = useState()

    const updateHire = (updatedHire) => {
        setHires((prevHires) =>
            prevHires.map((hire) =>
                hire.id === updatedHire.id ? updatedHire : hire
            )
        );
    };

    const deleteHire = (id) => {
        setHires((prevHires) =>
            prevHires.filter((hire) => hire.id !== id)
        );
    }

    return (
        <HireContext.Provider value={{hires, setHires, updateHire, deleteHire, currentHire, setCurrentHire}}>
            {children}
        </HireContext.Provider>
    );
}