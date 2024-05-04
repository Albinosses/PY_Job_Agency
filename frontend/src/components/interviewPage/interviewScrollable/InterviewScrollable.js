import React, {useContext, useEffect} from "react";
import Interview from "../interview/Interview";
import styles from "./InterviewScrollable.module.css";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {Link} from "react-router-dom";
import {CircularProgress} from "@mui/material";

function InterviewScrollable({interviewsObj}) {

    const {interviews, setInterviews, setCurrentInterview} = useContext(InterviewContext)

    useEffect(() => {
        setCurrentInterview(undefined)
        if (!interviewsObj || Object.keys(interviewsObj).length === 0) {
            fetch('http://127.0.0.1:8003/api/get/interviews?page=1')
                .then(response => response.json())
                .then(data => setInterviews(data.interviews))
                .catch(err => console.log(err));
        }
    }, [interviewsObj, setInterviews]);


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
                                    <Link to={`/interview/${interview.id}`} onClick={() => setCurrentInterview(interview)}>
                                        <Interview
                                            key={interview.id}
                                            interview={interview}
                                        />
                                    </Link>
                                ))) : (
                            interviews.map(interview => (
                                <Link to={`/interview/${interview.id}`} onClick={() => setCurrentInterview(interview)}>
                                    <Interview
                                        key={interview.id}
                                        interview={interview}
                                    />
                                </Link>
                            )))}
                    </div>
                </div>
            }

        </>

    );
}

export default InterviewScrollable;