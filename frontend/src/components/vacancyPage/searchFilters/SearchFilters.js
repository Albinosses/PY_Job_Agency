import React, {useContext, useEffect, useState} from "react";
import styles from "./SearchFilters.module.css";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import {VacancyContext} from "../../../contexts/VacancyContext";
import dayjs from "dayjs";
import Button from "@mui/material/Button";

function SearchFilters({setFilterChanged}) {
    const [sortOrder, setSortOrder] = useState('');
    const {vacancies, setVacancies} = useContext(VacancyContext)

    useEffect(() => {
        const savedSortOrder = localStorage.getItem("vacancies_sortOrder");
        if (savedSortOrder) {
            setSortOrder(savedSortOrder);
        }

        const savedVacancies = localStorage.getItem("vacancies");
        if (savedVacancies) {
            const parsedVacancies = JSON.parse(savedVacancies);
            setInputText(parsedVacancies.input)
            setType(parsedVacancies.type);
            setStatus(parsedVacancies.status);
            setWorkSetting(parsedVacancies.workSetting);
            setStartDate(parsedVacancies.startDate === null ? null : dayjs(parsedVacancies.startDate));
            setEndDate(parsedVacancies.endDate === null ? null : dayjs(parsedVacancies.endDate));
        }
    }, []);

    const [inputText, setInputText] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [type, setType] = useState('');
    const [status, setStatus] = useState('')
    const [workSetting, setWorkSetting] = useState('')

    const saveFiltersToLocalStorage = () => {
        const vacanciesObject = {
            input: inputText,
            type: type,
            status: status,
            workSetting: workSetting,
            startDate: startDate,
            endDate: endDate
        };
        localStorage.setItem("vacancies", JSON.stringify(vacanciesObject));
    };

    const saveTypeToLocalStorage = (e) => {
        const value = e.target.value;
        setType(value);
    };

    const saveStatusToLocalStorage = (e) => {
        const value = e.target.value;
        setStatus(value);
    };

    const saveWorkSettingToLocalStorage = (e) => {
        const value = e.target.value;
        setWorkSetting(value);
    };

    let inputHandler = (e) => {
        let lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

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

    const changeSortOrder = (e) => {
        const newSortOrder = e.target.value;
        localStorage.setItem("vacancies_sortOrder", newSortOrder);
        setSortOrder(newSortOrder);

        if (newSortOrder === 'new_first'){
            const sortedVacancies = [...vacancies].sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
            setVacancies(sortedVacancies);
        }
        if (newSortOrder === 'old_first'){
            const sortedVacancies = [...vacancies].sort((a, b) => new Date(a.publicationDate) - new Date(b.publicationDate));
            setVacancies(sortedVacancies);
        }
        if (newSortOrder === 'big_salary_first'){
            const sortedVacancies = [...vacancies].sort((a, b) => b.salary - a.salary);
            setVacancies(sortedVacancies);
        }
        if (newSortOrder === 'small_salary_first'){
            const sortedVacancies = [...vacancies].sort((a, b) => a.salary - b.salary);
            setVacancies(sortedVacancies);
        }
    }

    const [clearFilters, setClearFilters] = useState(false)

    const handleClearFilters = () => {
        setClearFilters(true)

        setInputText('')
        setType('')
        setStatus('')
        setWorkSetting('')
        setStartDate(null)
        setEndDate(null)
        setSortOrder('')

        localStorage.setItem("vacancies_sortOrder", '');
        setSortOrder('');
        setFilterChanged((prev) => !prev);
    }

    useEffect(() => {
        if(clearFilters){
            saveFiltersToLocalStorage();
            setClearFilters(false)
        }
    }, [clearFilters]);

    const handleApplyFilters = () => {
        saveFiltersToLocalStorage()
        setFilterChanged((prev) => !prev)
    }

    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <TextField
                        id="outlined-basic"
                        onChange={inputHandler}
                        variant="outlined"
                        label="Search"
                        value={inputText}
                    />
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <FormControl sx={{minWidth: 85}}>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            labelId="type-select-label"
                            id="type-select"
                            label="Type"
                            value={type}
                            onChange={saveTypeToLocalStorage}
                            autoWidth
                        >
                            <MenuItem value={'F'}>Full Time</MenuItem>
                            <MenuItem value={'P'}>Part Time</MenuItem>
                            <MenuItem value={'C'}>Contract</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <FormControl sx={{minWidth: 100}}>
                        <InputLabel id="status-select-label">Status</InputLabel>
                        <Select
                            labelId="status-select-label"
                            id="status-select"
                            label="Type"
                            onChange={saveStatusToLocalStorage}
                            value={status}
                            autoWidth
                        >
                            <MenuItem value={'O'}>Open</MenuItem>
                            <MenuItem value={'C'}>Closed</MenuItem>
                            <MenuItem value={'P'}>Postponed</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <FormControl sx={{minWidth: 160}}>
                        <InputLabel id="work-setting-select-label">Work Setting</InputLabel>
                        <Select
                            labelId="work-setting-select-label"
                            id="work-setting-select"
                            label="Work Setting"
                            onChange={saveWorkSettingToLocalStorage}
                            value={workSetting}
                            autoWidth
                        >
                            <MenuItem value={'P'}>Office</MenuItem>
                            <MenuItem value={'R'}>Remote</MenuItem>
                            <MenuItem value={'H'}>Hybrid</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <DatePicker
                        label="Start date"
                        value={startDate}
                        onChange={handleStartDateChange}
                    />
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <DatePicker
                        label="End date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        minDate={startDate}
                    />
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <FormControl sx={{minWidth: 160}}>
                        <InputLabel id="sort-setting-select-label">Sort</InputLabel>
                        <Select
                            labelId="sort-setting-select-label"
                            id="sort-setting-select"
                            label="Sort Setting"
                            onChange={changeSortOrder}
                            value={sortOrder}
                            autoWidth
                        >
                            <MenuItem value={'old_first'}>Old first</MenuItem>
                            <MenuItem value={'new_first'}>New first</MenuItem>
                            <MenuItem value={'big_salary_first'}>Big salary first </MenuItem>
                            <MenuItem value={'small_salary_first'}>Small salary first </MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <Button
                        variant="contained"
                        onClick={handleApplyFilters}
                    >
                        Apply
                    </Button>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <Button
                        variant="contained"
                        onClick={handleClearFilters}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default SearchFilters;
