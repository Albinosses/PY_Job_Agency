import React, {useState} from "react";
import VacancyTitle from "./vacancyTitle/VacancyTitle";
import SearchFilters from "./searchFilters/SearchFilters";
import VacancyScrollable from "./vacancyScrollable/VacancyScrollable";

function VacancyPage() {
    const [filterChanged, setFilterChanged] = useState(false);

    return (
        <div className="flex flex-col w-full">
            <VacancyTitle/>
            <SearchFilters setFilterChanged={setFilterChanged}/>
            <VacancyScrollable filterChanged={filterChanged}/>
        </div>
    );
}

export default VacancyPage;