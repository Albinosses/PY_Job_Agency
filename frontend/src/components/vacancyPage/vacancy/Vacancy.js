import React from "react";
import styles from "./Vacancy.module.css";

function Vacancy({ vacancy, onClick }) {
    const handleClick = () => {
        onClick(vacancy); // Call the onClick function with the vacancy object
    };

    return (
        <div className={styles.vacancyContainer} onClick={handleClick}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTitle}>{vacancy.jobTitle}</div>
                <div className={styles.vacancyTags}>
                    <div className={styles.vacancyTag}>{vacancy.empCountry}</div>
                    <div className={styles.vacancyTag}>{vacancy.company}</div>
                </div>
            </div>
            <div className={styles.vacancyDate}>{vacancy.publicationDate} - {vacancy.closeDate}</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>
    );
}

export default Vacancy;
