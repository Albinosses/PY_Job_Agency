import React, {useContext, useEffect, useState} from "react";
import styles from "./Hire.module.css";
import {GeneralContext} from "../../../contexts/GeneralContext";
import dayjs from "dayjs";

function Hire({hire}) {
    const {countries, companies} = useContext(GeneralContext)

    const [vacancy, setVacancy] = useState()

    useEffect(() => {
        fetch(`http://127.0.0.1:8003/api/get/vacancy/${hire.vacancyId}`)
            .then(response => response.json())
            .then(data => setVacancy(data.vacancy) )
            .catch(err => console.log(err))
    }, []);

    console.log(hire)
    console.log(vacancy)

    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTags}>
                    {vacancy && companies && countries &&
                        <>
                            <div
                                className={styles.vacancyTag}>{countries.find(country => country.id === vacancy.empCountryId).name}
                            </div>
                            <div
                                className={styles.vacancyTag}>{companies.find(company => company.id === vacancy.companyId).name}
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className={styles.vacancyDate}>{dayjs(hire.hireDate).format('YYYY-MM-DD')}</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>
    );
}

export default Hire;
