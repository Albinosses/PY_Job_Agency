import React, {useContext, useEffect, useState} from "react";
import Interview from "../interview/Interview";
import styles from "./InterviewScrollable.module.css";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {Link} from "react-router-dom";
import {CircularProgress} from "@mui/material";

function InterviewScrollable({interviewsObj, filterChanged}) {

    const {interviews, setInterviews, setCurrentInterview} = useContext(InterviewContext)

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const savedInterviews = localStorage.getItem("interviews");
        const parsedInterviews = JSON.parse(savedInterviews);

        console.log(parsedInterviews)

        let apiUrl = `http://127.0.0.1:8003/api/get/interviews?page=${currentPage}`;

        if(!interviewsObj || Object.keys(interviewsObj).length === 0){
            if (parsedInterviews.input !== "") {
                apiUrl += `&search=${parsedInterviews.input}`;
            }
            if (parsedInterviews.type !== "") {
                apiUrl += `&interviewTypeFilter=${parsedInterviews.type}`;
            }
            if (parsedInterviews.date !== null) {
                apiUrl += `&startDateFilter=${parsedInterviews.date}`;
            }
            if (localStorage.interviews_sortOrder !== '') {
                apiUrl += `&sortType=${localStorage.interviews_sortOrder}`;
            }
        }

        setCurrentInterview(undefined)
        if (!interviewsObj || Object.keys(interviewsObj).length === 0) {
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => setInterviews(data.interviews))
                .catch(err => console.log(err));
        }
    }, [currentPage, interviewsObj, setInterviews, setCurrentInterview, filterChanged]);

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
            { (!interviews || interviews.length === 0) &&
                <div className={styles.circularProgressContainer}>
                    <CircularProgress size={80} thickness={4}/>
                </div>
            }
            {(interviews || interviewsObj) &&
                <div className={styles.container}>
                    <div className={styles.scrollableContainer}>
                        {interviewsObj ? (
                            interviewsObj
                                .map(interview => (
                                    <Link key={interview.id} to={`/interview/${interview.id}`}
                                          onClick={() => setCurrentInterview(interview)}>
                                        <Interview
                                            key={interview.id}
                                            interview={interview}
                                        />
                                    </Link>
                                ))) : (
                            interviews.map(interview => (
                                <Link  key={interview.id} to={`/interview/${interview.id}`} onClick={() => setCurrentInterview(interview)}>
                                    <Interview
                                        key={interview.id}
                                        interview={interview}
                                    />
                                </Link>
                            )))}
                        {(!interviewsObj || Object.keys(interviewsObj).length === 0) &&
                            <div className={styles.pagination}>
                                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                                    Previous
                                </button>
                                <button onClick={handleNextPage}>Next</button>
                            </div>
                        }
                    </div>
                </div>
            }

        </>

    );
}

export default InterviewScrollable;