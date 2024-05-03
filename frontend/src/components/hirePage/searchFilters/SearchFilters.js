import React, {useContext, useEffect, useState} from "react";
import styles from "./SearchFilters.module.css";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import {InterviewContext} from "../../../contexts/InterviewContext";
import {HireContext} from "../../../contexts/HireContext";

function SearchFilters() {
    const [inputText, setInputText] = useState("");
    const [sortOrder, setSortOrder] = useState("");
    const {hires, setHires} = useContext(HireContext)

    useEffect(() => {
        const savedSortOrder = localStorage.getItem("hires_sortOrder");
        if (savedSortOrder) {
            setSortOrder(savedSortOrder);
        }
    }, []);

    let inputHandler = (e) => {
        //convert input text to lower case
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
        localStorage.setItem("hires_sortOrder", newSortOrder);
        setSortOrder(newSortOrder);

        if (newSortOrder === 'new_first'){
            const sortedVacancies = [...hires].sort((a, b) => new Date(b.hireDate) - new Date(a.hireDate));
            setHires(sortedVacancies);
        }
        if (newSortOrder === 'old_first'){
            const sortedVacancies = [...hires].sort((a, b) => new Date(a.hireDate) - new Date(b.hireDate));
            setHires(sortedVacancies);
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
                            autoWidth
                            onChange={changeSortOrder}
                            value={sortOrder}
                        >
                            <MenuItem value={'old_first'}>Old first</MenuItem>
                            <MenuItem value={'new_first'}>New first</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>
        </div>
    );
}

export default SearchFilters;
