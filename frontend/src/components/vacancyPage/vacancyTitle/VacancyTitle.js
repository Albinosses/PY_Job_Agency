import React, {useEffect, useState} from "react";
import styles from "./VacancyTitle.module.css";
import community from "./imgs/community.png"
import add from "./imgs/add.png"
import {Box, Divider, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Typography} from "@mui/material";
import TextField from "@mui/material/TextField";
import CustomNumberInput from "../../NumberInput";
import {DatePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1000,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function VacancyTitle() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false)
        setJobTitle("")
        setDescription("")
        setWorkSetting("")
        setType("")
        setStartDate(null)
        setEndDate(null)
        setSalary(null)
        setStatus(null)
        setItems([{ weight: null, skillName: "", level: "" }])
    };

    const [jobTitle, setJobTitle] = useState("")
    const handleChangeJobTitle = (e) => {
        setJobTitle(e.target.value);
    }

    const [description, setDescription] = useState("")
    const handleChangeDescription = (e) => {
        setDescription(e.target.value)
    }

    const [workSetting, setWorkSetting] = useState("")
    const handleWorkSettingChange = (e) => {
        setWorkSetting(e.target.value)
    }
    const [type, setType] = useState("")
    const handleChangeType = (e) => {
        setType(e.target.value)
    }

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const handleStartDateChange = (date) => {
        setStartDate(date);
        if (endDate && date > endDate) {
            setEndDate(null);
        }
    };
    const handleEndDateChange = (date) => {
        setEndDate(date);
        if (startDate && date < startDate) {
            setStartDate(null);
        }
    };

    const [salary, setSalary] = useState(null)
    const handleSalaryChange = (e, v) => {
        setSalary(v)
    }

    const [status, setStatus] = useState(null)
    const handleChangeStatus = (e) => {
        setStatus(e.target.value)
    }

    const [items, setItems] = useState([{ weight: null, skillName: "", level: "" }]);

    const handleAddItem = () => {
        setItems([...items, { weight: null, skillName: "", level: "" }]);
        console.log(items)
    };

    const handleRemoveItem = (index) => {
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
    };

    const handleChange = (index, key, value) => {
        const updatedItems = [...items];
        updatedItems[index][key] = value;
        setItems(updatedItems);
    };

    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const allInputsFilled =
            jobTitle.trim() !== "" &&
            description.trim() !== "" &&
            workSetting !== "" &&
            type !== "" &&
            status !== "" &&
            startDate !== null &&
            salary !== null &&
            (status === 'C' ? endDate !== null : true)
            items.every(
                (item) =>
                    item.skillName.trim() !== "" &&
                    item.level !== "" &&
                    item.weight !== null
            );

        const weightsSumTo100 = items.reduce(
            (sum, item) => sum + (item.weight || 0),
            0
        ) === 100;

        setIsValid(allInputsFilled && weightsSumTo100);
    }, [jobTitle, description, workSetting, type, status, items, startDate, endDate, salary]);

    const handleAddVacancy = () => {
        handleClose()
        //CALL to API for new items creation
    }


    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        <img
                            src={community}
                            className={`${styles.icon} aspect-square`}
                            alt="Vacancies Icon"
                        />
                    </div>
                    <div className={styles.title}>Vacancies</div>
                </div>
            </div>
            <div className={styles.createButton} onClick={handleOpen}>
                <img
                    src={add}
                    className={`${styles.icon} aspect-square`}
                    alt="Create Vacancy Icon"
                />
                <div>Create Vacancy</div>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h4" component="h2" align="center">
                        Add new vacancy
                    </Typography>
                    <div className={styles.container}>
                        <TextField
                            id="outlined-basic"
                            onChange={handleChangeJobTitle}
                            variant="outlined"
                            label="Job Title"
                        />
                        <TextField
                            id="outlined-basic"
                            onChange={handleChangeDescription}
                            variant="outlined"
                            label="Description"
                        />
                        <FormControl sx={{m: 1, minWidth: 160}}>
                            <InputLabel id="work-setting-select-label">Work Setting</InputLabel>
                            <Select
                                labelId="work-setting-select-label"
                                id="work-setting-select"
                                label="Work Setting"
                                value={workSetting}
                                onChange={handleWorkSettingChange}
                                autoWidth
                            >
                                <MenuItem value={'P'}>Office</MenuItem>
                                <MenuItem value={'R'}>Remote</MenuItem>
                                <MenuItem value={'H'}>Hybrid</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 85}}>
                            <InputLabel id="type-select-label">Type</InputLabel>
                            <Select
                                autoWidth
                                labelId="type-select-label"
                                id="type-select"
                                label="Type"
                                value={type}
                                onChange={handleChangeType}
                            >
                                <MenuItem value={'F'}>Full Time</MenuItem>
                                <MenuItem value={'P'}>Part Time</MenuItem>
                                <MenuItem value={'C'}>Contract</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl sx={{m: 1, minWidth: 100}}>
                            <InputLabel id="status-select-label">Status</InputLabel>
                            <Select
                                labelId="status-select-label"
                                id="status-select"
                                label="Type"
                                autoWidth
                                value={status}
                                onChange={handleChangeStatus}
                            >
                                <MenuItem value={'O'}>Open</MenuItem>
                                <MenuItem value={'C'}>Closed</MenuItem>
                                <MenuItem value={'P'}>Postponed</MenuItem>
                            </Select>
                        </FormControl>
                        <DatePicker
                            label="Publication date"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <DatePicker
                            label="Close date"
                            value={endDate}
                            onChange={handleEndDateChange}
                            minDate={startDate}
                            disabled={status !== 'C'}
                        />
                        <CustomNumberInput
                            placeholder="salary"
                            value={salary}
                            min={0}
                            onChange={handleSalaryChange}
                        />
                    </div>
                    <Divider />
                    <div className={styles.container}>
                        {items.map((item, index) => (
                            <Grid container spacing={2} key={index} alignItems="center">
                                <Grid item xs={4}>
                                    <TextField
                                        label="Skill Name"
                                        value={item.skillName}
                                        onChange={(e) => handleChange(index, 'skillName', e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <FormControl sx={{m: 1, minWidth: 100}}>
                                        <InputLabel id="level-select-label">Level</InputLabel>
                                        <Select
                                            labelId="level-select-label"
                                            label="Level"
                                            autoWidth
                                            value={item.level}
                                            onChange={(e) => handleChange(index, 'level', e.target.value)}
                                        >
                                            <MenuItem value={'J'}>Junior</MenuItem>
                                            <MenuItem value={'M'}>Middle</MenuItem>
                                            <MenuItem value={'S'}>Senior</MenuItem>
                                            <MenuItem value={'E'}>Principal</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <CustomNumberInput
                                        placeholder="weight"
                                        value={item.weight}
                                        min={0}
                                        max={100}
                                        onChange={(e, v) => handleChange(index, 'weight', v)}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    {items.length > 1 && (
                                        <Button
                                            variant="contained"
                                            onClick={() => handleRemoveItem(index)}
                                            sx={{ marginRight: 1 }}
                                        >
                                            -
                                        </Button>
                                    )}
                                    {items.length - 1 === index && (
                                        <Button
                                            variant="contained"
                                            onClick={handleAddItem}
                                        >
                                            +
                                        </Button>
                                    )}
                                </Grid>
                            </Grid>
                        ))}
                    </div>
                    <div className={styles.centeredDiv}>
                        <Button
                            variant="contained"
                            size="large"
                            align="center"
                            disabled={!isValid}
                            onClick={handleAddVacancy}
                        >
                            Add
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default VacancyTitle;
