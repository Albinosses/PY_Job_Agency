import React, {useContext} from "react";
import {useParams} from "react-router-dom";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {Container, Title} from "../../StyledComponents";
import InterviewDetails from "./InterviewDetails";
import InterviewInfo from "./InterviewInfo";

function VacancyDetails() {
    const { id } = useParams();
    const { interviews } = useContext(InterviewContext)

    const interview = interviews.find(interview => interview.id === parseInt(id));

    return (
        <Container>
            <Title>Interview Details</Title>
            <InterviewInfo interview={interview}/>
        </Container>
    )
}

export default VacancyDetails