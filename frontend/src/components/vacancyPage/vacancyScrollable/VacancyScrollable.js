import React, {useContext} from "react";
import Vacancy from "../vacancy/Vacancy";
import styles from "./VacancyScrollable.module.css";
import {Link} from "react-router-dom";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {CircularProgress} from "@mui/material";

function VacancyScrollable() {
    const {vacancies} = useContext(VacancyContext)

    return (
        <>
            {vacancies.length === 0 &&
                <div className={styles.circularProgressContainer}>
                    <CircularProgress size={80} thickness={4}/>
                </div>
            }
            <div className={styles.container}>
                <div className={styles.scrollableContainer}>
                    {vacancies.map((vacancy) => (
                        <Link to={`/vacancy/${vacancy.id}`}>
                            <Vacancy
                                key={vacancy.id}
                                vacancy={vacancy}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </>
    );
}

export default VacancyScrollable;