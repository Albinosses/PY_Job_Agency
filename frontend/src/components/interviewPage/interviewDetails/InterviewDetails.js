import React, {useContext} from "react";
import {useParams} from "react-router-dom";
import {InterviewContext} from "../../../contexts/InterviewContext";

function VacancyDetails() {
    const { id } = useParams();
    const { interviews } = useContext(InterviewContext)

    const interview = interviews.find(interview => interview.id === parseInt(id));

    return (
        <>
        </>
    )
}

export default VacancyDetails