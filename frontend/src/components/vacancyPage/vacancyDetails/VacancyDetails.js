import React, {useContext, useEffect, useState} from "react";
import VacancyAddModal from "../vacancyAddModal/VacancyAddModal";
import {useParams} from "react-router-dom";
import {VacancyContext} from "../../../contexts/VacancyContext";
import VacancyInfo from "./VacancyInfo";
import InterviewScrollable from "../../interviewPage/interviewScrollable/InterviewScrollable";
import {Container, ReturnButton, Title} from "../../StyledComponents";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {HireContext} from "../../../contexts/HireContext";
import HireScrollable from "../../hirePage/hireScrollable/HireScrollable";
import {useNavigate} from "react-router-dom";
import InterviewModal from "../../interviewPage/interviewModal/InterviewModal";
import HireModal from "../../hirePage/hireModal/HireModal";
import dayjs from "dayjs";

function VacancyDetails() {
    const {id} = useParams();
    const {isVacancyClosed, currentVacancy, setCurrentVacancy} = useContext(VacancyContext)
    const {interviews, setInterviews} = useContext(InterviewContext)
    const {hires, setHires} = useContext(HireContext)

    const navigate = useNavigate()

    const [openVacancy, setOpenVacancy] = useState(false);
    const [openInterview, setOpenInterview] = useState(false);
    const [openHire, setOpenHire] = useState(false)

    useEffect(() => {
        fetch(`http://127.0.0.1:8003/api/get/vacancy/${id}`)
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

                setHires(data.hires)
                setInterviews(data.interviews)
                setCurrentVacancy(updatedVacancy)
            })
            .catch(err => console.log(err))
    }, []);

    const handleOpen = (type) => {
        switch (type) {
            case 'vacancy':
                setOpenVacancy(true)
                break
            case 'interview':
                setOpenInterview(true)
                break
            case 'hire':
                setOpenHire(true)
                break
            default:
                return
        }
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8003/api/delete/vacancy/${id}`, {
                method: "DELETE",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if (!response.ok) {
                throw new Error('Failed to add vacancy');
            }
            navigate(`/vacancy`)
        } catch (error) {
            console.error('Error adding vacancy:', error);
        }
    }

    const handleCloseVacancy= async () => {
        const vacancyToSend = currentVacancy
        vacancyToSend.status = 'C'
        vacancyToSend.closeDate = dayjs().format("MM/DD/YYYY")
        vacancyToSend.publicationDate = dayjs(vacancyToSend.publicationDate).format("MM/DD/YYYY")

        try {
            const response = await fetch('http://127.0.0.1:8003/api/edit/vacancy', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(vacancyToSend)
            });

            if (!response.ok) {
                throw new Error('Failed to add vacancy');
            }

            navigate(0);
        } catch (error) {
            console.error('Error adding vacancy:', error);
        }
    }

    return (
        <Container>
            <Title>Vacancy Details</Title>
            {currentVacancy &&
                <>
                    <VacancyInfo vacancy={currentVacancy}/>
                    <ReturnButton
                        onClick={() => handleOpen('vacancy')}
                        variant="contained"
                        color="primary"
                    >
                        Edit
                    </ReturnButton>
                    <ReturnButton
                        onClick={handleCloseVacancy}
                        variant="contained"
                        color="primary"
                        disabled={isVacancyClosed(currentVacancy)}
                    >
                        Close
                    </ReturnButton>
                    <ReturnButton
                        onClick={handleDelete}
                        variant="contained"
                        color="primary"
                    >
                        Delete
                    </ReturnButton>
                    {openVacancy &&
                        <VacancyAddModal
                            open={openVacancy}
                            setOpen={setOpenVacancy}
                            modalType={'edit'}
                            data={currentVacancy}
                        />
                    }
                    {openInterview &&
                        <InterviewModal
                            open={openInterview}
                            setOpen={setOpenInterview}
                            modalType={'create'}
                        />
                    }
                    {openHire &&
                        <HireModal
                            open={openHire}
                            setOpen={setOpenHire}
                            modalType={'create'}
                        />
                    }
                    <div>
                        <ReturnButton
                            onClick={() => handleOpen('interview')}
                            variant="contained"
                            color="primary"
                        >
                            Add related interview
                        </ReturnButton>
                        <ReturnButton
                            onClick={() => handleOpen('hire')}
                            variant="contained"
                            color="primary"
                        >
                            Add related hire
                        </ReturnButton>
                    </div>
                    {interviews.some(interview => interview.vacancyId === currentVacancy.id) &&
                        <>
                            <Title>Related Interviews</Title>
                            <InterviewScrollable interviewsObj={interviews}/>
                        </>
                    }
                    {hires.some(hire => hire.vacancyId === currentVacancy.id) &&
                        <>
                            <Title>Related Hires</Title>
                            <HireScrollable hiresObj={hires}/>
                        </>
                    }
                </>
            }
        </Container>
    );
}

export default VacancyDetails;
