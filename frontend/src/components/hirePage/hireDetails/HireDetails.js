import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {HireContext} from "../../../contexts/HireContext";
import {Container, ReturnButton, Title} from "../../StyledComponents";
import Vacancy from "../../vacancyPage/vacancy/Vacancy";
import HireInfo from "./HireInfo";
import HireModal from "../hireModal/HireModal";

const HireDetails = () => {
    const {id} = useParams();
    const {currentHire, setCurrentHire} = useContext(HireContext)
    const {currentVacancy, setCurrentVacancy} = useContext(VacancyContext)
    const navigate = useNavigate()

    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch(`http://127.0.0.1:8003/api/get/hire/${id}`)
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

                setCurrentHire(data.hire)
                setCurrentVacancy(updatedVacancy);
            })
            .catch(err => console.log(err))
    }, []);

    const handleDelete = () => {
        //deleteHire(hire.id)
        navigate(`/hire`)
    }

    const handleEdit = () => {
        setOpen(true)
    }

    return (
        <>
            {currentHire && currentVacancy &&
                <>
                    <Container>
                        <Title>Interview Details</Title>
                        <HireInfo hire={currentHire}/>
                        <ReturnButton
                            onClick={handleEdit}
                            variant="contained"
                            color="primary"
                        >
                            Edit
                        </ReturnButton>
                        {open &&
                            <HireModal
                                open={open}
                                setOpen={setOpen}
                                modalType={'edit'}
                                data={currentHire}
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
                        <Link to={`/vacancy/${currentHire.vacancyId}`}>
                            <Vacancy
                                key={currentHire.vacancyId}
                                vacancy={currentVacancy}
                            />
                        </Link>
                    </Container>
                </>
            }
        </>
    )
}

export default HireDetails