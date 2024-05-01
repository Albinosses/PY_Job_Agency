import React, {useState} from "react";
import {Box, FormControl, InputLabel, MenuItem, Modal, Select} from "@mui/material";
import ContactInfoEdit from "../../contact/ContactInfoEdit";
import styles from "../../contact/ContactInfo.module.css";
import dayjs from "dayjs";
import {DatePicker} from "@mui/x-date-pickers";
import CustomNumberInput from "../../NumberInput";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
    const handleClose = () => {
        setOpen(false)
        //resetState();
    };

    const [formData, setFormData] = useState({
        id: "",
        vacancyId: "",
        candidate: {
            name: "",
            surname: "",
            birthDate: "",
            gender: "",
            email: ""
        },
        interviewer: {
            name: "",
            surname: "",
            birthDate: "",
            gender: "",
            email: ""
        },
        InterviewType: "",
        InterviewDate: "",
        duration: "",
        feedback: "",
        score: ""
    })

    const [score, setScore] = useState("")
    const [duration, setDuration] = useState("")
    const [feedback, setFeedback] = useState("")
    const [interviewDate, setInterviewDate] = useState("")
    const [interviewType, setInterviewType] = useState("")
    const [candidate, setCandidate] = useState({})
    const [interviewer, setInterviewer] = useState({})


    const handleAddInterview = () => {
        const result = {
            candidate: candidate,
            interviewer: interviewer,
            interviewType: interviewType,
            interviewDate: interviewDate,
            duration: duration,
            feedback: feedback,
            score: score
        }

        console.log(result)

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
                        type="create"
                        contact={candidate}
                        setContact={setCandidate}
                    />
                    <ContactInfoEdit
                        owner="Interviewer"
                        type="create"
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddInterview}
                    >
                        Add
                    </Button>
                </div>
            </Box>
        </Modal>
    )
}

export default InterviewModal