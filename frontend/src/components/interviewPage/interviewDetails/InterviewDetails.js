import React, {useContext} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {Container, ReturnButton, Title} from "../../StyledComponents";
import InterviewInfo from "./InterviewInfo";
import Vacancy from "../../vacancyPage/vacancy/Vacancy";
import {VacancyContext} from "../../../contexts/VacancyContext";

function InterviewDetails() {
    const { id } = useParams();
    const { interviews, deleteInterview } = useContext(InterviewContext)
    const { vacancies } = useContext(VacancyContext)
    const navigate = useNavigate()


    const interview = interviews.find(interview => interview.id === parseInt(id));

    const vacancy = vacancies.find(vacancy => vacancy.id === interview.vacancyId)

    const handleDelete = () => {
        deleteInterview(interview.id)
        navigate(`/vacancy/${vacancy.id}`)
    }

    return (
        <>
            <Container>
                <Title>Interview Details</Title>
                <InterviewInfo interview={interview}/>
                <ReturnButton
                    // onClick={handleOpen}
                    variant="contained"
                    color="primary"
                >
                    Edit
                </ReturnButton>
                <ReturnButton
                    onClick={handleDelete}
                    variant="contained"
                    color="primary"
                >
                    Delete
                </ReturnButton>
            </Container>
            <Container>
                <Title>Related Vacancy</Title>
                <Link to={`/vacancy/${interview.vacancyId}`}>
                    <Vacancy
                        key={interview.vacancyId}
                        vacancy={vacancy}
                    />
                </Link>
            </Container>
        </>

    )
}

export default InterviewDetails