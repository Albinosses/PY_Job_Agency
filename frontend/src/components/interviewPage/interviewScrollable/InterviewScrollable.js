import React, {useContext} from "react";
import Interview from "../interview/Interview";
import styles from "./InterviewScrollable.module.css";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {Link} from "react-router-dom";
import {CircularProgress} from "@mui/material";

function InterviewScrollable({vacancyId}) {
    const {interviews} = useContext(InterviewContext)

    return (
        <>
            {interviews.length === 0 &&
                <div className={styles.circularProgressContainer}>
                    <CircularProgress size={80} thickness={4}/>
                </div>
            }
            <div className={styles.container}>
                <div className={styles.scrollableContainer}>
                    {vacancyId ? (
                        interviews
                            .filter(interview => interview.vacancyId === vacancyId)
                            .map(interview => (
                                <Link to={`/interview/${interview.id}`}>
                                    <Interview
                                        key={interview.id}
                                        interview={interview}
                                    />
                                </Link>
                            ))) : (
                        interviews.map(interview => (
                            <Link to={`/interview/${interview.id}`}>
                                <Interview
                                    key={interview.id}
                                    interview={interview}
                                />
                            </Link>
                        )))}
                </div>
            </div>
        </>

    );
}

export default InterviewScrollable;