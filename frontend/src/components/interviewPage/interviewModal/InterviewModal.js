import React, {useContext, useEffect, useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Modal, Select} from "@mui/material";
import ContactInfoEdit from "../../contact/ContactInfoEdit";
import styles from "../../contact/ContactInfo.module.css";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers";
import CustomNumberInput from "../../NumberInput";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {useNavigate} from "react-router-dom";

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

const InterviewModal = ({open, setOpen, modalType, data}) => {
    const { updateInterview } = useContext(InterviewContext)
    const {currentVacancy} = useContext(VacancyContext)
    const navigate = useNavigate()
    const handleClose = () => {
        setOpen(false)
        resetState();
    };

    const [score, setScore] = useState(0)
    const [duration, setDuration] = useState(0)
    const [feedback, setFeedback] = useState("")
    const [interviewDate, setInterviewDate] = useState(null)
    const [interviewType, setInterviewType] = useState("H")
    const [interviewer, setInterviewer] = useState({})
    const [candidate, setCandidate] = useState({})
    const [interviewId, setInterviewId] = useState()

    const resetState = () => {
        setCandidate({id: 'temp', birthDate: null});
        setInterviewer({id: 'temp',  birthDate: null});
        setInterviewType('');
        setInterviewDate(null);
        setFeedback('');
        setDuration(0);
        setScore(0);
    }

    useEffect(() => {
        if (modalType === "edit") {
            setInterviewType(data.interviewType);
            setInterviewDate(data.interviewDate);
            setFeedback(data.feedback);
            setDuration(data.duration);
            setScore(data.score);
            setInterviewId(data.id)

            fetch(`http://127.0.0.1:8003/api/get/contact?id=${data.candidateId}`)
                .then(response => response.json())
                .then(data => setCandidate(data))
                .catch(err => console.log(err));

            fetch(`http://127.0.0.1:8003/api/get/contact?id=${data.interviewerId}`)
                .then(response => response.json())
                .then(data => setInterviewer(data))
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
            contact.date !== null &&
            contact.gender !== "" &&
            contact.email.trim() !== "" &&
            contact.countryId !== null
    }

    useEffect(() => {
        const allInputsFilled =
            feedback.trim() !== "" &&
            interviewType !== "" &&
            interviewDate !== null &&
            duration !== null &&
            score !== null &&
            isContactValid(interviewer) &&
            isContactValid(candidate)

        setIsValid(allInputsFilled);
    }, [feedback, interviewer, candidate, interviewType, interviewDate, duration, score]);

    const handleAddInterview = async () => {
        const updatedInterviewer = {...interviewer}
        delete updatedInterviewer.id

        const updatedCandidate = {...candidate}
        delete updatedCandidate.id


        const dataToSend = {
            'vacancyId': currentVacancy.id,
            'interviewType': interviewType,
            'interviewDate': dayjs(interviewDate).format('MM/DD/YYYY'),
            'duration': duration,
            'feedback': feedback,
            'score': score,
            'candidateInfo': updatedCandidate,
            'interviewerInfo': updatedInterviewer
        };

        console.log(dataToSend)

        try {
            const response = await fetch('http://127.0.0.1:8003/api/insert/interview', {
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
            navigate(`/interview/${responseData.id}`);
        } catch (error) {
            console.error('Error adding vacancy:', error);
        } finally {
            handleClose();
        }
    }

    const handleEditInterview = async () => {
        const updatedInterviewer = {...interviewer}
        updatedInterviewer.birthDate = dayjs(updatedInterviewer.birthDate).format('MM/DD/YYYY')

        const updatedCandidate = {...candidate}
        updatedCandidate.birthDate = dayjs(updatedCandidate.birthDate).format('MM/DD/YYYY')


        const dataToSend = {
            'id': interviewId,
            'vacancyId': currentVacancy.id,
            'interviewType': interviewType,
            'interviewDate': dayjs(interviewDate).format('MM/DD/YYYY'),
            'duration': duration,
            'feedback': feedback,
            'score': score,
            'candidateInfo': updatedCandidate,
            'interviewerInfo': updatedInterviewer
        };

        try {
            const response = await fetch('http://127.0.0.1:8003/api/edit/interview', {
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
            navigate(0);
        } catch (error) {
            console.error('Error adding vacancy:', error);
        } finally {
            handleClose();
        }
    }

    const handleInterviewDateChange = (date) => {
        setInterviewDate(date)
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
                        contact={candidate}
                        setContact={setCandidate}
                    />
                    <ContactInfoEdit
                        owner="Interviewer"
                        type={modalType}
                        contact={interviewer}
                        setContact={setInterviewer}
                    />
                </div>
                <div className={styles.editContainer}>
                    <FormControl sx={{width: 300}}>
                        <InputLabel id="gender-select-label">Interview Type</InputLabel>
                        <Select
                            autoWidth
                            labelId="gender-select-label"
                            id="gender-select"
                            label="Gender"
                            value={interviewType}
                            onChange={(e) => setInterviewType(e.target.value)}
                        >
                            <MenuItem sx={{width: 300}} value={'S'}>Screening</MenuItem>
                            <MenuItem sx={{width: 300}} value={'H'}>HR interview</MenuItem>
                            <MenuItem sx={{width: 300}} value={'T'}>Tech interview</MenuItem>
                        </Select>
                    </FormControl>
                    <DatePicker
                        sx={{width: 300}}
                        label="Interview Date"
                        onChange={handleInterviewDateChange}
                        value={dayjs(interviewDate)}
                    />
                    <TextField
                        sx={{width: 300}}
                        id="outlined-basic"
                        onChange={(e) => setFeedback(e.target.value)}
                        variant="outlined"
                        label="Feedback"
                        value={feedback}
                    />
                    <CustomNumberInput
                        sx={{width: 300}}
                        placeholder="Duration"
                        onChange={(e, v) => setDuration(v)}
                        value={duration}
                        min={0}
                    />
                    <CustomNumberInput
                        placeholder="Score"
                        sx={{width: 300}}
                        onChange={(e, v) => setScore(v)}
                        value={score}
                        min={0}
                        max={10}
                    />
                </div>
                <div className={styles.editContainer}>
                    {modalType === 'create' &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddInterview}
                            disabled={!isValid}
                        >
                            Add
                        </Button>
                    }
                    {modalType === 'edit' &&
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEditInterview}
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

export default InterviewModal