import React, {useState} from "react";
import styles from "./SearchFilters.module.css";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";

function SearchFilters() {
    const [inputText, setInputText] = useState("");
    let inputHandler = (e) => {
        //convert input text to lower case
        let lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        // If an end date is already selected and it comes before the new start date,
        // reset the end date to null
        if (endDate && date > endDate) {
            setEndDate(null);
        }
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        // If a start date is already selected and it comes after the new end date,
        // reset the start date to null
        if (startDate && date < startDate) {
            setStartDate(null);
        }
    };

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
                    <FormControl sx={{m: 1, minWidth: 85}}>
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
                    <FormControl sx={{m: 1, minWidth: 100}}>
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
                    <FormControl sx={{m: 1, minWidth: 160}}>
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
        </div>
    );
}

export default SearchFilters;
