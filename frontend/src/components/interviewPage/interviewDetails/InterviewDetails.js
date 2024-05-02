import React, {useContext, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {Container, ReturnButton, Title} from "../../StyledComponents";
import InterviewInfo from "./InterviewInfo";
import Vacancy from "../../vacancyPage/vacancy/Vacancy";
import {VacancyContext} from "../../../contexts/VacancyContext";
import InterviewModal from "../interviewModal/InterviewModal";

function InterviewDetails() {
    const {id} = useParams();
    const {interviews, deleteInterview} = useContext(InterviewContext)
    const {vacancies} = useContext(VacancyContext)
    const navigate = useNavigate()


    const interview = interviews.find(interview => interview.id === parseInt(id));

    const vacancy = vacancies.find(vacancy => vacancy.id === interview.vacancyId)

    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        deleteInterview(interview.id)
        navigate(`/interview`)
    }

    const handleEdit = () => {
        setOpen(true)
    }

    return (
        <>
            <Container>
                <Title>Interview Details</Title>
                <InterviewInfo interview={interview}/>
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
                        data={interview}
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