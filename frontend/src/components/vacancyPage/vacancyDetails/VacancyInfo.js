import React, {useContext} from "react";
import {StyledParagraph, SkillContainer} from "../../StyledComponents";
import {GeneralContext} from "../../../contexts/GeneralContext";

function VacancyInfo({vacancy}) {
    const {countries, companies} = useContext(GeneralContext)
    const getFullEmploymentType = (abr) => {
        switch (abr) {
            case 'F':
                return 'Full Time';
            case 'P':
                return 'Part Time';
            case 'C':
                return 'Contract';
            default:
                return '';
        }
    }

    const getFullStatus = (abr) => {
        switch (abr) {
            case 'O':
                return 'Open';
            case 'C':
                return 'Closed';
            case 'P':
                return 'Postponed';
            default:
                return '';
        }
    }

    const getFullWorkSetting = (abr) => {
        switch (abr) {
            case 'P':
                return 'Office';
            case 'R':
                return 'Remote';
            case 'H':
                return 'Hybrid';
            default:
                return '';
        }
    }

    const getFullSkillLevel = (abr) => {
        switch (abr) {
            case 'J':
                return 'Junior';
            case 'M':
                return 'Middle';
            case 'S':
                return 'Senior';
            case 'E':
                return 'Principal';
            default:
                return '';
        }
    }

    return (
        <>
            <StyledParagraph>Title: {vacancy.jobTitle}</StyledParagraph>
            <StyledParagraph>Description: {vacancy.description}</StyledParagraph>
            <StyledParagraph>Location: {countries.find(country => country.id === vacancy.empCountryId).name}</StyledParagraph>
            <StyledParagraph>Company: {companies.find(company => company.id === vacancy.companyId).name}</StyledParagraph>
            <StyledParagraph>Salary: {vacancy.salary}</StyledParagraph>
            <StyledParagraph>Employment Type: {getFullEmploymentType(vacancy.employmentType)}</StyledParagraph>
            <StyledParagraph>Work Setting: {getFullWorkSetting(vacancy.workSetting)}</StyledParagraph>
            <StyledParagraph>Publication Date: {vacancy.publicationDate}</StyledParagraph>
            {vacancy.status === 'C' &&
                <StyledParagraph>Close Date: {vacancy.closeDate}</StyledParagraph>
            }
            <StyledParagraph>Status: {getFullStatus(vacancy.status)}</StyledParagraph>
            {vacancy.skills.map((skill, index) => (
                <SkillContainer key={index}>
                    <h2>Skill: {skill.skillName}</h2>
                    <StyledParagraph>Level: {getFullSkillLevel(skill.level)}</StyledParagraph>
                    <StyledParagraph>Weight: {skill.weight}</StyledParagraph>
                </SkillContainer>
            ))}
        </>
    );
}

export default VacancyInfo;
