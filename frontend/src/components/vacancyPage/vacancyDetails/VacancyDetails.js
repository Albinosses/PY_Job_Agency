import React, { useContext, useState } from "react";
import VacancyAddModal from "../vacancyAddModal/VacancyAddModal";
import { useParams } from "react-router-dom";
import { VacancyContext } from "../../../contexts/VacancyContext";
import VacancyInfo from "./VacancyInfo";
import InterviewScrollable from "../../interviewPage/interviewScrollable/InterviewScrollable";
import {Container, ReturnButton, Title} from "../../StyledComponents";
import {InterviewContext} from "../../../contexts/InterviewContext";

function VacancyDetails() {
    const { id } = useParams();
    const { vacancies } = useContext(VacancyContext)
    const { interviews } = useContext(InterviewContext)

    const vacancy = vacancies.find(vacancy => vacancy.id === parseInt(id));

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true)
    }

    return (
        <Container>
            <Title>Vacancy Details</Title>
            <VacancyInfo vacancy={vacancy} />
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
                />
            }
            {interviews.some(interview => interview.vacancyId === vacancy.id) &&
                <>
                    <Title>Related Interviews</Title>
                    <InterviewScrollable vacancyId={vacancy.id} />
                </>
            }

        </Container>
    );
}

export default VacancyDetails;
