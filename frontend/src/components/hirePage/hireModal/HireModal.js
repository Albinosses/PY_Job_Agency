import React, {useContext, useEffect, useState} from "react";
import {Box, Modal} from "@mui/material";
import ContactInfoEdit from "../../contact/ContactInfoEdit";
import styles from "../../contact/ContactInfo.module.css";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import {HireContext} from "../../../contexts/HireContext";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 950,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const HireModal = ({open, setOpen, modalType, data}) => {

    const {updateHire} = useContext(HireContext)
    const handleClose = () => {
        setOpen(false)
        resetState();
    };

    const [hireDate, setHireDate] = useState(data?.hireDate || "")
    const [employee, setEmployee] = useState({})

    const resetState = () => {
        setEmployee({});
        setHireDate('');
    }

    useEffect(() => {
        if (modalType === "edit") {
            setEmployee(data.employee);
            setHireDate(data.hireDate);
        } else {
            resetState()
        }
    }, [modalType, data]);

    const [isValid, setIsValid] = useState(false);

    const isContactValid = (contact) => {
        if (Object.keys(contact).length !== 5) {
            return false
        }

        return contact.name.trim() !== "" &&
            contact.surname.trim() !== "" &&
            contact.date !== '' &&
            contact.gender !== "" &&
            contact.email.trim() !== ""
    }

    useEffect(() => {
        const allInputsFilled =
            hireDate !== '' &&
            isContactValid(employee)

        setIsValid(allInputsFilled);
    }, [hireDate, employee]);


    const handleAddHire = () => {
        //CALL to API for new items creation
        handleClose()
    }

    const handleEditHire = () => {
        const hireData = {
            id: data.id,
            vacancyId: data.vacancyId,
            employee: employee,
            hireDate: dayjs(hireDate).format('YYYY-MM-DD')
        };
        updateHire(hireData)
        handleClose()
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