import React, {useContext, useEffect, useState} from "react";
import {Box, Divider, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Typography} from "@mui/material";
import styles from "../vacancyTitle/VacancyTitle.module.css";
import TextField from "@mui/material/TextField";
import {DatePicker} from "@mui/x-date-pickers";
import CustomNumberInput from "../../NumberInput";
import Button from "@mui/material/Button";
import dayjs from "dayjs";
import {VacancyContext} from "../../../contexts/VacancyContext";
import {GeneralContext} from "../../../contexts/GeneralContext";
import {useNavigate} from "react-router-dom";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 1100,
    maxHeight: '80%', // Set maximum height to 80%
    overflowY: 'auto', // Enable vertical scroll if content overflows
    overflowX: 'hidden',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function VacancyAddModal({open, setOpen, modalType, data}) {
    const {countries, companies} = useContext(GeneralContext)
    const navigate = useNavigate()

    const [countryId, setCountryId] = useState(modalType === 'create' ? '' : 0)
    const [companyId, setCompanyId] = useState(modalType === 'create' ? '' : 0)
    const handleCompanyChange = (e) => {
        setCompanyId(e.target.value)
    }

    //don't touch!!!
    console.log(data)
    const handleClose = () => {
        setOpen(false)
        resetState();
    };

    const {updateVacancy} = useContext(VacancyContext)

    const resetState = () => {
        setJobTitle("");
        setDescription("");
        setWorkSetting("");
        setType("");
        setStartDate(null);
        setEndDate(null);
        setSalary(null);
        setStatus('');
        setItems([{weight: null, skillName: "", level: ""}]);
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

    const [status, setStatus] = useState('')
    const handleChangeStatus = (e) => {
        setStatus(e.target.value)
    }

    const [items, setItems] = useState([{weight: null, skillName: "", level: ""}]);

    const handleAddItem = () => {
        setItems([...items, {weight: null, skillName: "", level: ""}]);
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

    useEffect(() => {
        if (modalType === 'edit') {
            console.log(data.empCountryId)

            setJobTitle(data.jobTitle);
            setDescription(data.description);
            setWorkSetting(data.workSetting);
            setType(data.employmentType);
            setSalary(data.salary);
            setStatus(data.status);
            setCountryId(data.empCountryId)
            setCompanyId(data.companyId)
            setStartDate(dayjs(data.publicationDate));
            setEndDate(dayjs(data.closeDate));
            setItems(data.skills);
        } else {
            resetState();
        }

    }, [modalType, data]);

    const handleAddVacancy = async () => {
        const data = {
            'companyId': companyId,
            'empCountryId': countryId,
            'jobTitle': jobTitle,
            'salary': salary,
            'employmentType': type,
            'workSetting': workSetting,
            'publicationDate': dayjs(startDate).format('MM/DD/YYYY'),
            'status': status,
            'description': description,
            'closeDate': status === 'C' ? dayjs(endDate).format('MM/DD/YYYY') : null,
            'skills': items
        };

        console.log(data)

        try {
            const response = await fetch('http://127.0.0.1:8003/api/insert/vacancy', {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to add vacancy');
            }

            const responseData = await response.json();
            console.log(responseData)
            navigate(`/vacancy/${responseData.id}`);
        } catch (error) {
            console.error('Error adding vacancy:', error);
        } finally {
            handleClose();
        }
    };


    const handleEditVacancy = () => {
        const vacancyData = {
            id: data.id,
            jobTitle: jobTitle,
            company: "company",
            empCountry: "country",
            description: description,
            salary: salary,
            employmentType: type,
            workSetting: workSetting,
            status: status,
            // publicationDate: startDate.format('YYYY-MM-DD'), // Format the date as needed
            // closeDate: endDate.format('YYYY-MM-DD'), // Format the date as needed
            // skills: items,
        };
        updateVacancy(vacancyData)
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
                <Typography id="modal-modal-title" variant="h4" component="h2" align="center">
                    Add new vacancy
                </Typography>
                <div className={styles.container}>
                    <TextField
                        id="outlined-basic"
                        onChange={handleChangeJobTitle}
                        variant="outlined"
                        label="Job Title"
                        value={jobTitle}
                    />
                    <TextField
                        id="outlined-basic"
                        onChange={handleChangeDescription}
                        variant="outlined"
                        label="Description"
                        value={description}
                    />
                    <FormControl sx={{m: 1, minWidth: 160}}>
                        <InputLabel id="work-setting-select-label">Work Setting</InputLabel>
                        <Select
                            autoWidth
                            labelId="work-setting-select-label"
                            id="work-setting-select"
                            label="Work Setting"
                            value={workSetting}
                            onChange={handleWorkSettingChange}
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
                            autoWidth
                            labelId="status-select-label"
                            id="status-select"
                            label="Status"
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
                        value={status !== 'C' ? null : endDate}
                        onChange={handleEndDateChange}
                        minDate={startDate}
                        disabled={status !== 'C'}
                    />
                    <FormControl sx={{m: 1, minWidth: 100}}>
                        <InputLabel id="company-select-label">Company</InputLabel>
                        <Select
                            autoWidth
                            labelId="company-select-label"
                            id="company-select"
                            label="Company"
                            value={companyId}
                            onChange={handleCompanyChange}
                        >
                            {companies.map((company) => (
                                <MenuItem value={company.id} key={company.id}>
                                    {company.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{m: 1, minWidth: 100}}>
                        <InputLabel id="country-select-label">Country</InputLabel>
                        <Select
                            autoWidth
                            labelId="country-select-label"
                            id="country-select"
                            label="Country"
                            value={countryId}
                            onChange={(e) => {setCountryId(e.target.value)}}
                        >
                            {countries.map(country => (
                                <MenuItem value={country.id}>
                                    {country.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <CustomNumberInput
                        placeholder="salary"
                        value={salary}
                        min={0}
                        onChange={handleSalaryChange}
                    />
                </div>
                <Divider/>
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
                                        sx={{marginRight: 1}}
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
                    {modalType === 'create' &&
                        <Button
                            variant="contained"
                            size="large"
                            align="center"
                            disabled={!isValid}
                            onClick={handleAddVacancy}
                        >
                            Add
                        </Button>
                    }
                    {modalType === 'edit' &&
                        <Button
                            variant="contained"
                            size="large"
                            align="center"
                            disabled={!isValid}
                            onClick={handleEditVacancy}
                        >
                            Ok
                        </Button>
                    }
                </div>
            </Box>
        </Modal>
    )
}

export default VacancyAddModal