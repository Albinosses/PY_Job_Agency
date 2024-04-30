import React from "react";
import ContactInfo from "../../candidate/ContactInfo";
import styles from "./InterviewInfo.module.css";

function InterviewInfo({ interview }) {
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
            <div className={styles.container}>
                <ContactInfo contact={interview.candidate} owner={"Candidate Contact"} />
                <ContactInfo contact={interview.interviewer} owner={"Interviewer Contact"} />
            </div>
            {/*{interview.skills.map((skill, index) => (*/}
            {/*    <SkillContainer key={index}>*/}
            {/*        <h2>Skill: {skill.skillName}</h2>*/}
            {/*        <StyledParagraph>Level: {getFullSkillLevel(skill.level)}</StyledParagraph>*/}
            {/*        <StyledParagraph>Weight: {skill.weight}</StyledParagraph>*/}
            {/*    </SkillContainer>*/}
            {/*))}*/}
        </>
    );
}

export default InterviewInfo;
