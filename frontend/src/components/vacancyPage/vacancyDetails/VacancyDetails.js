import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/system";
import VacancyAddModal from "../vacancyAddModal/VacancyAddModal";
import { useParams } from "react-router-dom";
import { VacancyContext } from "../../../contexts/VacancyContext";
import VacancyInfo from "./VacancyInfo";

const Container = styled("div")({
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
});

const ReturnButton = styled(Button)({
    margin: "16px",
});

const Title = styled("h2")({
    textAlign: "center",
    marginBottom: "16px",
});

function VacancyDetails() {
    const { id } = useParams();
    const { vacancies } = useContext(VacancyContext)

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
            <Title>Related Interviews</Title>
        </Container>
    );
}

export default VacancyDetails;
