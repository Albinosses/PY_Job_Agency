import React from "react";
import VacancyTitle from "./vacancyTitle/VacancyTitle";
import SearchFilters from "./searchFilters/SearchFilters";
import VacancyScrollable from "./vacancyScrollable/VacancyScrollable";

function VacancyPage() {
    return (
        <div className="flex flex-col w-full">
            <VacancyTitle/>
            <SearchFilters/>
            <VacancyScrollable/>
            <iframe
                width={1000}
                height={400}
                src="https://public.tableau.com/views/Vacancies_17147379559880/Dashboard1?:showVizHome=no&:embed=true"
            />
        </div>
    );
}

export default VacancyPage;