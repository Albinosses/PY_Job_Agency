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
    const handleClose = () => {
        setOpen(false)
        resetState();
    };

    const [score, setScore] = useState("")
    const [duration, setDuration] = useState("")
    const [feedback, setFeedback] = useState("")
    const [interviewDate, setInterviewDate] = useState(data?.InterviewDate || "")
    const [interviewType, setInterviewType] = useState("H")
    const [interviewer, setInterviewer] = useState({})
    const [candidate, setCandidate] = useState({})


    useEffect(() => {

    }, []);
    const resetState = () => {
        setCandidate({id: 'temp'});
        setInterviewer({id: 'temp'});
        setInterviewType('');
        setInterviewDate('');
        setFeedback('');
        setDuration('');
        setScore('');
    }

    useEffect(() => {
        if (modalType === "edit") {
            setInterviewType(data.interviewType);
            setInterviewDate(data.interviewDate);
            setFeedback(data.feedback);
            setDuration(data.duration);
            setScore(data.score);

            fetch(`http://127.0.0.1:8003/api/get/contact?id=${data.candidateId}`)
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    setCandidate(data)
                })
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


    const handleAddInterview = () => {
        //CALL to API for new items creation
        handleClose()
    }

    const handleEditInterview = () => {
        const interviewData = {
            id: data.id,
            vacancyId: data.vacancyId,
            candidate: candidate,
            interviewer: interviewer,
            InterviewType: interviewType,
            InterviewDate: dayjs(interviewDate).format('YYYY-MM-DD'),
            duration: duration,
            feedback: feedback,
            score: score
        };
        updateInterview(interviewData)
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
                        onChange={(date) => setInterviewDate(date)}
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