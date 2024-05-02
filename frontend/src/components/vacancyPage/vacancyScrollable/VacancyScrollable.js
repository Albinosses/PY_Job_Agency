import React, {useContext} from "react";
import Vacancy from "../vacancy/Vacancy";
import styles from "./VacancyScrollable.module.css";
import {Link} from "react-router-dom";
import {VacancyContext} from "../../../contexts/VacancyContext";

function VacancyScrollable() {
    const {vacancies} = useContext(VacancyContext)

    return (
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
    );
}

export default VacancyScrollable;