import React from "react";
import ContactInfo from "../../contact/ContactInfo";
import styles from "./InterviewInfo.module.css";
import {StyledParagraph} from "../../StyledComponents";

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

    return (
        <>
            {/*<div className={styles.container}>*/}
            {/*    <ContactInfo contact={interview.candidate} owner={"Candidate"}/>*/}
            {/*    <ContactInfo contact={interview.interviewer} owner={"Interviewer"}/>*/}
            {/*</div>*/}
            <StyledParagraph>Interview Type: {getFullType(interview.InterviewType)}</StyledParagraph>
            <StyledParagraph>Interview Date: {interview.InterviewDate}</StyledParagraph>
            <StyledParagraph>Duration: {interview.duration} min</StyledParagraph>
            <StyledParagraph>Feedback: {interview.feedback}</StyledParagraph>
            <StyledParagraph>Total Score: {interview.score} / 10</StyledParagraph>
        </>
    );
}

export default InterviewInfo;
