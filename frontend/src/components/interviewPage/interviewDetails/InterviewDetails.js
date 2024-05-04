import React, {useContext, useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {Container, ReturnButton, Title} from "../../StyledComponents";
import InterviewInfo from "./InterviewInfo";
import Vacancy from "../../vacancyPage/vacancy/Vacancy";
import {VacancyContext} from "../../../contexts/VacancyContext";
import InterviewModal from "../interviewModal/InterviewModal";

function InterviewDetails() {
    const {id} = useParams();
    const {interviews, deleteInterview, currentInterview} = useContext(InterviewContext)
    const {vacancies} = useContext(VacancyContext)
    const navigate = useNavigate()

    const vacancy = vacancies.find(vacancy => vacancy.id === currentInterview.vacancyId)

    const [open, setOpen] = useState(false);


    const handleDelete = () => {
        //deleteInterview(interview.id)
        navigate(`/interview`)
    }

    const handleEdit = () => {
        setOpen(true)
    }

    return (
        <>
            <Container>
                <Title>Interview Details</Title>
                <InterviewInfo interview={currentInterview}/>
                <ReturnButton
                    onClick={handleEdit}
                    variant="contained"
                    color="primary"
                >
                    Edit
                </ReturnButton>
                {open &&
                    <InterviewModal
                        open={open}
                        setOpen={setOpen}
                        modalType={'edit'}
                        data={currentInterview}
                    />
                }
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
                <Link to={`/vacancy/${currentInterview.vacancyId}`}>
                    <Vacancy
                        key={currentInterview.vacancyId}
                        vacancy={vacancy}
                    />
                </Link>
            </Container>
        </>
    )
}

export default InterviewDetails