import React from "react";
import HireScrollable from "./hireScrollable/HireScrollable";
import HireTitle from "./hireTitle/HireTitle";
import SearchFilters from "./searchFilters/SearchFilters";

function VacancyPage() {
    return (
        <div className="flex flex-col w-full">
            <HireTitle />
            <SearchFilters />
            <HireScrollable />
        </div>
    );
}

export default VacancyPage;
