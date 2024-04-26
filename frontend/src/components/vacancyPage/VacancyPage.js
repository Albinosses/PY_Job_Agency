import React from "react";
import Vacancy from "./vacancy/Vacancy";
import VacancyTitle from "./vacancyTitle/VacancyTitle";
import SearchFilters from "./searchFilters/SearchFilters";

function VacancyPage() {
    return (
        <div className="flex flex-col w-full">
            <VacancyTitle />
            <SearchFilters />
            <Vacancy />
        </div>
    );
}

export default VacancyPage;
