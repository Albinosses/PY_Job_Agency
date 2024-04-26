import React from "react";
import styles from "./Vacancy.module.css";

function Vacancy() {
    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTitle}>Vacancy name</div>
                <div className={styles.vacancyTags}>
                    <div className={styles.vacancyTag}>Country</div>
                    <div className={styles.vacancyTag}>Company</div>
                </div>
            </div>
            <div className={styles.vacancyDate}>11 Jan 2023 - 01 Feb 2024</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>
    );
}

export default Vacancy;
