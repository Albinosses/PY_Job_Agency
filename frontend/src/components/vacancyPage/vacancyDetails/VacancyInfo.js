import React, {useContext} from "react";
import {StyledParagraph, SkillContainer} from "../../StyledComponents";
import {GeneralContext} from "../../../contexts/GeneralContext";
import {VacancyContext} from "../../../contexts/VacancyContext";
import dayjs from "dayjs";

function VacancyInfo() {
    const {countries, companies} = useContext(GeneralContext)
    const {currentVacancy} = useContext(VacancyContext)

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
            {currentVacancy &&
                <>
                    <StyledParagraph>Title: {currentVacancy.jobTitle}</StyledParagraph>
                    <StyledParagraph>Description: {currentVacancy.description}</StyledParagraph>
                    <StyledParagraph>Location: {countries.find(country => country.id === currentVacancy.empCountryId).name}</StyledParagraph>
                    <StyledParagraph>Company: {companies.find(company => company.id === currentVacancy.companyId).name}</StyledParagraph>
                    <StyledParagraph>Salary: {currentVacancy.salary}</StyledParagraph>
                    <StyledParagraph>Employment Type: {getFullEmploymentType(currentVacancy.employmentType)}</StyledParagraph>
                    <StyledParagraph>Work Setting: {getFullWorkSetting(currentVacancy.workSetting)}</StyledParagraph>
                    <StyledParagraph>Publication Date: {dayjs(currentVacancy.publicationDate).format('YYYY-MM-DD')}</StyledParagraph>
                    {currentVacancy.status === 'C' &&
                        <StyledParagraph>Close Date: {dayjs(currentVacancy.closeDate).format('YYYY-MM-DD')}</StyledParagraph>
                    }
                    <StyledParagraph>Status: {getFullStatus(currentVacancy.status)}</StyledParagraph>
                    {currentVacancy.skills.map((skill, index) => (
                        <SkillContainer key={index}>
                            <h2>Skill: {skill.skillName}</h2>
                            <StyledParagraph>Level: {getFullSkillLevel(skill.level)}</StyledParagraph>
                            <StyledParagraph>Weight: {skill.weight}</StyledParagraph>
                        </SkillContainer>
                    ))}
                </>
            }
        </>
    );
}

export default VacancyInfo;
