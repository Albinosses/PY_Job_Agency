import {createContext, useState} from "react";

export const VacancyContext = createContext({})


const mockVacancies = [
    {
        id: 1,
        jobTitle: "Software Engineer",
        company:"Samsung",
        empCountry: "USA",
        description: "Lorem ipsum dolor sit amet...",
        salary: 100000,
        employmentType: 'F',
        workSetting: 'R',
        publicationDate: "2024-04-27",
        closeDate: "2024-05-27",
        status: 'C',
        skills: [
            {
                skillName: "Researching",
                level: "J",
                weight: 50
            },
            {
                skillName: "OOP",
                level: "M",
                weight: 25
            },
            {
                skillName: "SQL",
                level: "M",
                weight: 25
            }
        ]
    },
    {
        id: 2,
        jobTitle: "Product Manager",
        company: "Apple",
        empCountry: "USA",
        description: "Lorem ipsum dolor sit amet...",
        salary: 120000,
        employmentType: "F",
        workSetting: "P",
        publicationDate: "2024-04-25",
        closeDate: "2024-05-25",
        status: "O",
        skills: [
            {
                skillName: "Researching",
                level: "J",
                weight: 50
            },
            {
                skillName: "OOP",
                level: "S",
                weight: 50
            }
        ]
    }
];

export const VacancyProvider = ({ children }) => {
    const [vacancies, setVacancies] = useState(mockVacancies);

    const updateVacancy = (updatedVacancy) => {
        setVacancies((prevVacancies) =>
            prevVacancies.map((vacancy) =>
                vacancy.id === updatedVacancy.id ? updatedVacancy : vacancy
            )
        );
    };

    return (
        <VacancyContext.Provider value={{ vacancies, setVacancies, updateVacancy }}>
            {children}
        </VacancyContext.Provider>
    );
};