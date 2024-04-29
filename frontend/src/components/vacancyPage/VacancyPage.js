import React, {useState, useEffect} from "react";
import VacancyTitle from "./vacancyTitle/VacancyTitle";
import SearchFilters from "./searchFilters/SearchFilters";
import VacancyScrollable from "./vacancyScrollable/VacancyScrollable";
import VacancyDetails from "./vacancyDetails/VacancyDetails";

function VacancyPage() {
    const [vacancies, setVacancies] = useState([]);
    const [selectedVacancy, setSelectedVacancy ] = useState(null)

    const handleVacancyClick = (vacancy) => {
        console.log("Navigate to vacancy details page for:", vacancy);
        setSelectedVacancy(vacancy)
    };

    // Mock data while API is not available
    const mockVacancies = [
        {
            id: 1,
            jobTitle: "Software Engineer",
            company:"Samsung",
            empCountry: "USA",
            description: "Lorem ipsum dolor sit amet...",
            salary: "$80,000 - $100,000",
            employmentType: "Full-time",
            workSetting: "Remote",
            publicationDate: "2024-04-27",
            closeDate: "2024-05-27",
            status: "Open",
            skills: [
                {
                    skill: "Researching",
                    level: "Junior",
                    weight: 50
                },
                {
                    skill: "OOP",
                    level: "Middle",
                    weight: 25
                },
                {
                    skill: "SQL",
                    level: "Middle",
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
            salary: "$90,000 - $120,000",
            employmentType: "Full-time",
            workSetting: "Office",
            publicationDate: "2024-04-25",
            closeDate: "2024-05-25",
            status: "Open",
            skills: [
                {
                    skill: "Researching",
                    level: "J",
                    weight: 50
                },
                {
                    skill: "OOP",
                    level: "S",
                    weight: 50
                }
            ]
        }
    ];

    useEffect(() => {
        setVacancies(mockVacancies);
    }, [mockVacancies]);

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
                    />
                </>
            )}
        </div>
    );
}

export default VacancyPage;
