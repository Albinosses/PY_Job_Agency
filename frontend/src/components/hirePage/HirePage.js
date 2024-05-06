import React, {useState} from "react";
import HireScrollable from "./hireScrollable/HireScrollable";
import HireTitle from "./hireTitle/HireTitle";
import SearchFilters from "./searchFilters/SearchFilters";

function VacancyPage() {
    const [filterChanged, setFilterChanged] = useState(false);

    return (
        <div className="flex flex-col w-full">
            <HireTitle/>
            <SearchFilters setFilterChanged={setFilterChanged}/>
            <HireScrollable filterChanged={filterChanged}/>
        </div>
    );
}

export default VacancyPage;
