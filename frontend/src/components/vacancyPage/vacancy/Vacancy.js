import React, {useContext} from "react";
import styles from "./Vacancy.module.css";
import {GeneralContext} from "../../../contexts/GeneralContext";

function Vacancy({vacancy}) {

    const {countries, companies} = useContext(GeneralContext)


    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTitle}>{vacancy.jobTitle}</div>
                <div className={styles.vacancyTags}>
                    <div className={styles.vacancyTag}>{countries.find(country => country.id === vacancy.empCountryId).name}</div>
                    <div className={styles.vacancyTag}>{companies.find(company => company.id === vacancy.companyId).name}</div>
                </div>
            </div>
            <div className={styles.vacancyDate}>{vacancy.publicationDate} - {vacancy.closeDate}</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>
    );
}

export default Vacancy;
