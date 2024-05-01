import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useContext} from "react";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {HireContext} from "../../../contexts/HireContext";
import {Container, ReturnButton, Title} from "../../StyledComponents";
import Vacancy from "../../vacancyPage/vacancy/Vacancy";
import HireInfo from "./HireInfo";


const HireDetails = () => {
    const { id } = useParams();
    const { hires, deleteHire } = useContext(HireContext)
    const { vacancies } = useContext(VacancyContext)
    const navigate = useNavigate()


    const hire = hires.find(hire => hire.id === parseInt(id));

    const vacancy = vacancies.find(vacancy => vacancy.id === hire.vacancyId)

    const handleDelete = () => {
        deleteHire(hire.id)
        navigate(`/hire`)
    }

    return (
        <>
            <Container>
                <Title>Interview Details</Title>
                <HireInfo hire={hire}/>
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
                <Link to={`/vacancy/${hire.vacancyId}`}>
                    <Vacancy
                        key={hire.vacancyId}
                        vacancy={vacancy}
                    />
                </Link>
            </Container>
        </>
    )
}

export default HireDetails