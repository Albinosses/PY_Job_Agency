import React, {useContext} from "react";
import Interview from "../interview/Interview";
import styles from "./InterviewScrollable.module.css";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {Link} from "react-router-dom";

function InterviewScrollable({ vacancyId }) {
    const { interviews } = useContext(InterviewContext)

    return (
        <div className={styles.container}>
            <div className={styles.scrollableContainer}>
                { vacancyId ? (
                    interviews
                        .filter(interview => interview.vacancyId === vacancyId)
                        .map(interview => (
                            <Link to={`/interview/${interview.id}`}>
                                <Interview
                                    key={interview.id}
                                    vacancy={interview}
                                />
                            </Link>
                    ))) : (
                    interviews.map(interview => (
                        <Link to={`/interview/${interview.id}`}>
                            <Interview
                                key={interview.id}
                                vacancy={interview}
                            />
                        </Link>
                    )))}
            </div>
        </div>
    );
}

export default InterviewScrollable;