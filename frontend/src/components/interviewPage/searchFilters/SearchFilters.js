import React, {useState} from "react";
import styles from "./SearchFilters.module.css";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import NumberInputIntroduction from "../../NumberInput";
import CustomNumberInput from "../../NumberInput";

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

    const [minScore, setMinScore] = useState(0);
    const [maxScore, setMaxScore] = useState(10);

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
                            <MenuItem value={'S'}>Screening</MenuItem>
                            <MenuItem value={'H'}>HR manager</MenuItem>
                            <MenuItem value={'T'}>Technical</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <CustomNumberInput
                        placeholder="Min score value…"
                        value={minScore}
                        min={0}
                        max={maxScore}
                        onChange={(event, val) => setMinScore(val)}
                    />
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <CustomNumberInput
                        placeholder="Max score value…"
                        value={maxScore}
                        min={minScore}
                        max={10}
                        onChange={(event, val) => setMaxScore(val)}
                    />
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