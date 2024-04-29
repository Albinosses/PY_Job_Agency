import React, {useState, useEffect} from "react";
import VacancyTitle from "./vacancyTitle/VacancyTitle";
import SearchFilters from "./searchFilters/SearchFilters";
import VacancyScrollable from "./vacancyScrollable/VacancyScrollable";
import VacancyDetails from "./vacancyDetails/VacancyDetails";

function VacancyPage() {
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

    const [vacancies, setVacancies] = useState(mockVacancies);
    const [selectedVacancy, setSelectedVacancy ] = useState(null)

    const handleVacancyClick = (vacancy) => {
        console.log("Navigate to vacancy details page for:", vacancy);
        setSelectedVacancy(vacancy)
    };

    const updateVacancy = (updatedVacancy) => {
        setVacancies((prevVacancies) =>
            prevVacancies.map((vacancy) =>
                vacancy.id === updatedVacancy.id ? updatedVacancy : vacancy
            )
        );
    };

    return (
        <div className="flex flex-col w-full">
            {selectedVacancy === null && (
                <>
                    <VacancyTitle />
                    <SearchFilters />
                    <VacancyScrollable
                        vacancies={vacancies}
                        handleVacancyClick={handleVacancyClick}
                    />
                </>
            )}
            {selectedVacancy !== null && (
                <>
                    <VacancyDetails
                        vacancy={ selectedVacancy }
                        setVacancy={ setSelectedVacancy }
                        updateAllVacancies={ updateVacancy }
                    />
                </>
            )}
        </div>
    );
}

export default VacancyPage;
