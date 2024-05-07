import React, {useContext, useEffect, useState} from "react";
import {Box, Modal} from "@mui/material";
import ContactInfoEdit from "../../contact/ContactInfoEdit";
import styles from "../../contact/ContactInfo.module.css";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import {HireContext} from "../../../contexts/HireContext";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {useNavigate} from "react-router-dom";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: 650,
    transform: 'translate(-50%, -50%)',
    width: 950,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const HireModal = ({open, setOpen, modalType, data, employeeContactId}) => {
    const {currentVacancy} = useContext(VacancyContext)
    const {updateHire} = useContext(HireContext)
    const navigate = useNavigate()
    const handleClose = () => {
        setOpen(false)
        resetState();
    };

    const [hireDate, setHireDate] = useState(data?.hireDate || "")
    const [employee, setEmployee] = useState({})
    const [hireId, setHireId] = useState()

    const resetState = () => {
        setEmployee({id: 'temp'});
        setHireDate('');
    }

    useEffect(() => {
        if (modalType === "edit") {
            setHireDate(data.hireDate);
            setHireId(data.id)

            fetch(`http://127.0.0.1:8003/api/get/contact?id=${employeeContactId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setEmployee(data)
                })
                .catch(err => console.log(err));
        } else {
            resetState()
        }
    }, [modalType, data]);

    const [isValid, setIsValid] = useState(false);

    const isContactValid = (contact) => {
        if (Object.keys(contact).length !== 7) {
            return false
        }

        return contact.name.trim() !== "" &&
            contact.surname.trim() !== "" &&
            contact.date !== '' &&
            contact.gender !== "" &&
            contact.email.trim() !== "" &&
            contact.countryId !== null
    }

    useEffect(() => {
        const allInputsFilled =
            hireDate !== '' &&
            isContactValid(employee)

        setIsValid(allInputsFilled);
    }, [hireDate, employee]);


    const handleAddHire = async () => {
        const updatedEmployee = {...employee}
        delete updatedEmployee.id
        updatedEmployee.resumeUploadDate = "02/02/2024"

        const dataToSend = {
            'vacancyId': currentVacancy.id,
            'hireDate': dayjs(hireDate).format('MM/DD/YYYY'),
            'employeeInfo': updatedEmployee
        };

        console.log(dataToSend)

        try {
            const response = await fetch('http://127.0.0.1:8003/api/insert/hire', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error('Failed to add vacancy');
            }

            const responseData = await response.json();
            console.log(responseData)
            navigate(`/hire/${responseData.id}`);
        } catch (error) {
            console.error('Error adding vacancy:', error);
        } finally {
            handleClose();
        }
    }

    const handleEditHire = async () => {
        const updatedEmployee = {...employee}
        updatedEmployee.birthDate = dayjs(updatedEmployee.birthDate).format('MM/DD/YYYY')
        updatedEmployee.resumeUploadDate = "02/02/2024"

        const dataToSend = {
            'id': hireId,
            'vacancyId': currentVacancy.id,
            'hireDate': dayjs(hireDate).format('MM/DD/YYYY'),
            'employeeInfo': updatedEmployee
        };

        try {
            const response = await fetch('http://127.0.0.1:8003/api/edit/hire', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error('Failed to add vacancy');
            }

            const responseData = await response.json();
            navigate(0);
        } catch (error) {
            console.error('Error adding vacancy:', error);
        } finally {
            handleClose();
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className={styles.editContainer}>
                    <ContactInfoEdit
                        owner="Candidate"
                        type={modalType}
                        contact={employee}
                        setContact={setEmployee}
                    />
                </div>
                <div className={styles.editContainer}>
                    <DatePicker
                        sx={{width: 300}}
                        label="Hire Date"
                        onChange={(date) => setHireDate(date)}
                        value={dayjs(hireDate)}
                    />
                </div>
                <div className={styles.editContainer}>
                    {modalType === 'create' &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddHire}
                            disabled={!isValid}
                        >
                            Add
                        </Button>
                    }
                    {modalType === 'edit' &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditHire}
                            disabled={!isValid}
                        >
                            Save
                        </Button>
                    }
                </div>
            </Box>
        </Modal>
    )
}

export default HireModal