import React, {useState} from "react";
import Vacancy from "../vacancy/Vacancy";
import styles from "./VacancyScrollable.module.css";
import VacancyDetails from "../vacancyDetails/VacancyDetails";

function VacancyScrollable({ vacancies, handleVacancyClick }) {

    return (
        <div className={styles.container}>
            <div className={styles.scrollableContainer}>
                {vacancies.map((vacancy, index) => (
                    <Vacancy
                        key={index}
                        vacancy={vacancy}
                        onClick={() => handleVacancyClick(vacancy)}
                    />
                ))}
            </div>
        </div>
    );
}

export default VacancyScrollable;