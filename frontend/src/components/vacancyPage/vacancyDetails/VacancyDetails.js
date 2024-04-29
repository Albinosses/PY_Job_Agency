import React, {useState} from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import Typography from "@mui/material/Typography";
import VacancyAddModal from "../vacancyAddModal/VacancyAddModal";

const Container = styled("div")({
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
});

const ReturnButton = styled(Button)({
    margin: "16px",
});

const Title = styled("h2")({
    textAlign: "center",
    marginBottom: "16px",
});

const StyledParagraph = styled(Typography)({
    fontSize: "1.1rem",
    lineHeight: "1.6",
});

const SkillContainer = styled("div")({
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "16px",
});

function VacancyDetails({ vacancy, setVacancy, updateAllVacancies }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true)
    }
    const handleReturnButton = () => {
        updateAllVacancies(vacancy)
        setVacancy(null);
    };

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
        <Container>
            <ReturnButton
                onClick={handleReturnButton}
                variant="contained"
                color="primary"
            >
                Return
            </ReturnButton>
            <Title>Vacancy Details</Title>
            <StyledParagraph>Title: {vacancy.jobTitle}</StyledParagraph>
            <StyledParagraph>Description: {vacancy.description}</StyledParagraph>
            <StyledParagraph>Location: {vacancy.empCountry}</StyledParagraph>
            <StyledParagraph>Company: {vacancy.company}</StyledParagraph>
            <StyledParagraph>Salary: {vacancy.salary}</StyledParagraph>
            <StyledParagraph>Employment Type: {getFullEmploymentType(vacancy.employmentType)}</StyledParagraph>
            <StyledParagraph>Work Setting: {getFullWorkSetting(vacancy.workSetting)}</StyledParagraph>
            <StyledParagraph>Publication Date: {vacancy.publicationDate}</StyledParagraph>
            <StyledParagraph>Close Date: {vacancy.closeDate}</StyledParagraph>
            <StyledParagraph>Status: {getFullStatus(vacancy.status)}</StyledParagraph>
            {vacancy.skills.map((skill, index) => (
                <SkillContainer key={index}>
                    <h2>Skill: {skill.skillName}</h2>
                    <StyledParagraph>Level: {getFullSkillLevel(skill.level)}</StyledParagraph>
                    <StyledParagraph>Weight: {skill.weight}</StyledParagraph>
                </SkillContainer>
            ))}
            <ReturnButton
                onClick={handleOpen}
                variant="contained"
                color="primary"
            >
                Edit
            </ReturnButton>
            {open &&
                <VacancyAddModal
                    open={open}
                    setOpen={setOpen}
                    modalType={'edit'}
                    data={vacancy}
                    setVacancy={setVacancy}
                />
            }
        </Container>
    );
}

export default VacancyDetails;
