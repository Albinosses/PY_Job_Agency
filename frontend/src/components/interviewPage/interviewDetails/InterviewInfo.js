import React, {useEffect, useState} from "react";
import ContactInfo from "../../contact/ContactInfo";
import styles from "./InterviewInfo.module.css";
import {StyledParagraph} from "../../StyledComponents";
import dayjs from "dayjs";

function InterviewInfo({interview}) {
    const getFullType = (abr) => {
        switch (abr) {
            case 'S':
                return 'Screening';
            case 'H':
                return 'HR interview';
            case 'T':
                return 'Tech interview';
            default:
                return '';
        }
    }


    const [interviewer, setInterviewer] = useState()
    const [candidate, setCandidate] = useState()

    useEffect(() => {
        fetch(`http://127.0.0.1:8003/api/get/contact?id=${interview.candidateId}`)
            .then(response => response.json())
            .then(data => setCandidate(data))
            .catch(err => console.log(err));

        fetch(`http://127.0.0.1:8003/api/get/contact?id=${interview.interviewerId}`)
            .then(response => response.json())
            .then(data => setInterviewer(data))
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            {candidate && interviewer &&
                <div className={styles.container}>
                    <ContactInfo contact={candidate} owner={"Candidate"}/>
                    <ContactInfo contact={interviewer} owner={"Interviewer"}/>
                </div>
            }
            <StyledParagraph>Interview Type: {getFullType(interview.interviewType)}</StyledParagraph>
            <StyledParagraph>Interview Date: {dayjs(interview.interviewDate).format('YYYY-MM-DD')}</StyledParagraph>
            <StyledParagraph>Duration: {interview.duration} min</StyledParagraph>
            <StyledParagraph>Feedback: {interview.feedback}</StyledParagraph>
            <StyledParagraph>Total Score: {interview.score} / 10</StyledParagraph>
        </>
    );
}

export default InterviewInfo;
