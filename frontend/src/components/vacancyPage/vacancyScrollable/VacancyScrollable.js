import React, {useContext, useEffect, useState} from "react";
import Vacancy from "../vacancy/Vacancy";
import styles from "./VacancyScrollable.module.css";
import {Link} from "react-router-dom";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {CircularProgress} from "@mui/material";

function VacancyScrollable() {
    const {vacancies, setVacancies, setCurrentVacancy} = useContext(VacancyContext)

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentVacancy(undefined)
        fetch(`http://127.0.0.1:8003/api/get/vacancies?page=${currentPage}`)
            .then(response => response.json())
            .then(data => {setVacancies(data.vacancies)} )
            .catch(err => console.log(err))
        console.log(vacancies)
    }, [setVacancies, currentPage]);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

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
                        <div className={styles.pagination}>
                            <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <button onClick={handleNextPage}>Next</button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}

export default VacancyScrollable;