import React, {useContext, useEffect, useState} from "react";
import Vacancy from "../vacancy/Vacancy";
import styles from "./VacancyScrollable.module.css";
import {Link} from "react-router-dom";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {CircularProgress} from "@mui/material";
import dayjs from "dayjs";

function VacancyScrollable(filterChanged ) {
    const {vacancies, setVacancies, setCurrentVacancy} = useContext(VacancyContext)

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const savedVacancies = localStorage.getItem("vacancies");
        const parsedVacancies = JSON.parse(savedVacancies);

        console.log(parsedVacancies)

        let apiUrl = `http://127.0.0.1:8003/api/get/vacancies?page=${currentPage}`;

        if (parsedVacancies.status !== "") {
            apiUrl += `&statusFilter=${parsedVacancies.status}`;
        }
        if (parsedVacancies.type !== "") {
            apiUrl += `&employmentTypeFilter=${parsedVacancies.type}`;
        }
        if (parsedVacancies.workSetting !== "") {
            apiUrl += `&workSettingFilter=${parsedVacancies.workSetting}`;
        }
        if (parsedVacancies.input !== "") {
            apiUrl += `&search=${parsedVacancies.input}`;
        }
        if (parsedVacancies.startDate !== null) {
            apiUrl += `&startDateFilter=${parsedVacancies.startDate}`;
        }
        if (parsedVacancies.endDate !== null) {
            apiUrl += `&endDateFilter=${parsedVacancies.endDate}`;
        }

        setCurrentVacancy(undefined)
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {setVacancies(data.vacancies)} )
            .catch(err => console.log(err))
    }, [setVacancies, currentPage, filterChanged]);

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
                            <Link  key={vacancy.id} to={`/vacancy/${vacancy.id}`}>
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