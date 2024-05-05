import {createContext, useContext, useState} from "react";
import {InterviewContext} from "./InterviewContext";
import {HireContext} from "./HireContext";

export const VacancyContext = createContext({})

export const VacancyProvider = ({children}) => {
    const {setInterviews} = useContext(InterviewContext)
    const {setHires} = useContext(HireContext)

    const [vacancies, setVacancies] = useState([]);
    const [currentVacancy, setCurrentVacancy] = useState()

    const updateVacancy = (updatedVacancy) => {
        setVacancies((prevVacancies) =>
            prevVacancies.map((vacancy) =>
                vacancy.id === updatedVacancy.id ? updatedVacancy : vacancy
            )
        );
    };

    const deleteVacancy = (id) => {
        setVacancies((prevVacancies) =>
            prevVacancies.filter((vacancy) => vacancy.id !== id)
        );

        setInterviews((prevInterviews) =>
            prevInterviews.filter((interview) => interview.vacancyId !== id)
        )

        setHires((prevHires) =>
            prevHires.filter((hire) => hire.vacancyId !== id)
        )
    }

    const isVacancyClosed = (vacancy) => {
        return vacancy.status === "C"
    }

    return (
        <VacancyContext.Provider value={{vacancies, setVacancies, updateVacancy, deleteVacancy, isVacancyClosed, currentVacancy, setCurrentVacancy}}>
            {children}
        </VacancyContext.Provider>
    );
};