import React, {useContext} from "react";
import styles from "./Vacancy.module.css";
import {GeneralContext} from "../../../contexts/GeneralContext";
import dayjs from "dayjs";

function Vacancy({vacancy}) {

    const {countries, companies} = useContext(GeneralContext)


    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTitle}>{vacancy.jobTitle}</div>
                <div className={styles.vacancyTags}>
                    {countries && companies &&
                        <>
                            <div
                                className={styles.vacancyTag}>{countries.find(country => country.id === vacancy.empCountryId).name}</div>
                            <div
                                className={styles.vacancyTag}>{companies.find(company => company.id === vacancy.companyId).name}</div>
                        </>
                    }
                </div>
            </div>
            {vacancy.status === "C" &&
                <div className={styles.vacancyDate}>{dayjs(vacancy.publicationDate).format('YYYY-MM-DD')} - {dayjs(vacancy.closeDate).format('YYYY-MM-DD')}</div>
            }
            {vacancy.status !== "C" &&
                <div className={styles.vacancyDate}>{dayjs(vacancy.publicationDate).format('YYYY-MM-DD')}</div>
            }

            <div className={styles.vacancyLink}>Learn more</div>
        </div>
    );
}

export default Vacancy;
