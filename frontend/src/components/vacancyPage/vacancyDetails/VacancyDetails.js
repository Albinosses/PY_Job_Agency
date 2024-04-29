import React from "react";
import Button from "@mui/material/Button";
import Vacancy from "../vacancy/Vacancy";

function VacancyDetails({vacancy, setVacancy}) {

    const handleReturnButton = () => {
        setVacancy(null)
    }

    return (
        <div>
            <Button
                onClick={handleReturnButton}
            >
                Return
            </Button>
            <h2>Vacancy Details</h2>
            <p>Title: {vacancy.jobTitle}</p>
            <p>Description: {vacancy.description}</p>
            <p>Location: {vacancy.empCountry}</p>
            <p>Company: {vacancy.company}</p>
            <p>Salary: {vacancy.salary}</p>
            <p>Employment Type: {vacancy.employmentType}</p>
            <p>Work Setting: {vacancy.workSetting}</p>
            <p>Publication Date: {vacancy.publicationDate}</p>
            <p>Close Date: {vacancy.closeDate}</p>
            <p>Status: {vacancy.status}</p>
            {vacancy.skills.map((skill, index) => (
                <div>
                    <h2>Skill number {index + 1}</h2>
                    <p>Skill: {skill.skill}</p>
                    <p>Level: {skill.level}</p>
                    <p>Weight: {skill.weight}</p>
                </div>
            ))}
        </div>
    );
}

export default VacancyDetails