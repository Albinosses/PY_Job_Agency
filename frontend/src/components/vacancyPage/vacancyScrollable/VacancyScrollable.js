import React from "react";
import Vacancy from "../vacancy/Vacancy";
import styles from "./VacancyScrollable.module.css";

function VacancyScrollable() {
    return (
        <div className={styles.container}>
            <div className={styles.scrollableContainer}>
                {[...Array(20)].map((_, index) => (
                    <Vacancy key={index} />
                ))}
            </div>
        </div>
    );
}

export default VacancyScrollable;