import React, {useState, useEffect, useContext} from "react";
import VacancyTitle from "./vacancyTitle/VacancyTitle";
import SearchFilters from "./searchFilters/SearchFilters";
import VacancyScrollable from "./vacancyScrollable/VacancyScrollable";
import {VacancyContext} from "../../contexts/VacancyContext";

function VacancyPage() {
    return (
        <div className="flex flex-col w-full">
            <VacancyTitle />
            <SearchFilters />
            <VacancyScrollable/>
        </div>
    );
}

export default VacancyPage;