import React, {useContext, useEffect, useState} from "react";
import styles from "./SearchFilters.module.css";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import {VacancyContext} from "../../../contexts/VacancyContext";

function SearchFilters() {
    const [inputText, setInputText] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const {vacancies, setVacancies} = useContext(VacancyContext)

    useEffect(() => {
        const savedSortOrder = localStorage.getItem("vacancies_sortOrder");
        if (savedSortOrder) {
            setSortOrder(savedSortOrder);
        }
    }, []);

    let inputHandler = (e) => {
        let lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

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


    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <TextField
                        id="outlined-basic"
                        onChange={inputHandler}
                        variant="outlined"
                        label="Search"
                    />
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <FormControl sx={{minWidth: 85}}>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            autoWidth
                            labelId="type-select-label"
                            id="type-select"
                            label="Type"
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
        </div>
    );
}

export default SearchFilters;
