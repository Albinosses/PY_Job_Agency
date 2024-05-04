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
    const {currentInterview, setCurrentInterview} = useContext(InterviewContext)
    const {currentVacancy, setCurrentVacancy} = useContext(VacancyContext)
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:8003/api/get/interview/${id}`)
            .then(response => response.json())
            .then(data => {
                const modifiedSkills = data.skills.map(skill => ({
                    ...skill,
                    weight: parseInt(skill.weight * 100)
                }));

                const updatedVacancy = {
                    ...data.vacancy,
                    skills: modifiedSkills
                };

                setCurrentInterview(data.interview)
                setCurrentVacancy(updatedVacancy);
            })
            .catch(err => console.log(err))
    }, []);


    const handleDelete = () => {
        //deleteInterview(interview.id)
        navigate(`/interview`)
    }

    const handleEdit = () => {
        setOpen(true)
    }

    return (
        <>
            {currentInterview && currentVacancy &&
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
                            vacancy={currentVacancy}
                        />
                    </Link>
                </Container>
            </>
            }
        </>
    )
}

export default InterviewDetails