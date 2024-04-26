import React from "react";
import styles from "./VacancyTitle.module.css";
import community from "./imgs/community.png"
import add from "./imgs/add.png"

function VacancyTitle() {
    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <img
                            src={community}
                            className={`${styles.icon} aspect-square`}
                            alt="Vacancies Icon"
                        />
                    </div>
                    <div className={styles.title}>Vacancies</div>
                </div>
            </div>
            <div className={styles.createButton}>
                <img
                    src={add}
                    className={`${styles.icon} aspect-square`}
                    alt="Create Vacancy Icon"
                />
                <div>Create Vacancy</div>
            </div>
        </div>
    );
}

export default VacancyTitle;
