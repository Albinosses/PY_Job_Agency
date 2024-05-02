import React, {useContext, useState} from "react";
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

function VacancyDetails() {
    const {id} = useParams();
    const {vacancies, deleteVacancy} = useContext(VacancyContext)
    const {interviews} = useContext(InterviewContext)
    const {hires} = useContext(HireContext)
    const navigate = useNavigate()

    const vacancy = vacancies.find(vacancy => vacancy.id === parseInt(id));

    const [openVacancy, setOpenVacancy] = useState(false);
    const [openInterview, setOpenInterview] = useState(false);
    const [openHire, setOpenHire] = useState(false)

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

    const handleDelete = () => {
        deleteVacancy(vacancy.id)
        navigate(`/vacancy`)
    }

    return (
        <Container>
            <Title>Vacancy Details</Title>
            <VacancyInfo vacancy={vacancy}/>
            <ReturnButton
                onClick={() => handleOpen('vacancy')}
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
            {openVacancy &&
                <VacancyAddModal
                    open={openVacancy}
                    setOpen={setOpenVacancy}
                    modalType={'edit'}
                    data={vacancy}
                />
            }
            {openInterview &&
                <InterviewModal
                    open={openInterview}
                    setOpen={setOpenInterview}
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
            {interviews.some(interview => interview.vacancyId === vacancy.id) &&
                <>
                    <Title>Related Interviews</Title>
                    <InterviewScrollable vacancyId={vacancy.id}/>
                </>
            }
            {hires.some(hire => hire.vacancyId === vacancy.id) &&
                <>
                    <Title>Related Hires</Title>
                    <HireScrollable vacancyId={vacancy.id}/>
                </>
            }
        </Container>
    );
}

export default VacancyDetails;
