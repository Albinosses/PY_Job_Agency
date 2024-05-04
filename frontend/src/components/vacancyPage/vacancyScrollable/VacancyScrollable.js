import React, {useContext, useEffect} from "react";
import Vacancy from "../vacancy/Vacancy";
import styles from "./VacancyScrollable.module.css";
import {Link} from "react-router-dom";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {CircularProgress} from "@mui/material";

function VacancyScrollable() {
    const {vacancies, setVacancies, setCurrentVacancy} = useContext(VacancyContext)

    useEffect(() => {
        setCurrentVacancy(undefined)
        fetch('http://127.0.0.1:8003/api/get/vacancies?page=1')
            .then(response => response.json())
            .then(data => {setVacancies(data.vacancies)} )
            .catch(err => console.log(err))
        console.log(vacancies)
    }, [setVacancies]);

    return (
        <>
            {( !vacancies || vacancies.length === 0)  &&
                <div className={styles.circularProgressContainer}>
                    <CircularProgress size={80} thickness={4}/>
                </div>
            }
            { vacancies &&
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
            }
        </>
    );
}

export default VacancyScrollable;