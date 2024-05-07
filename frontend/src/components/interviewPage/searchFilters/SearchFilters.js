import React, {useContext, useEffect, useState} from "react";
import styles from "./SearchFilters.module.css";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import CustomNumberInput from "../../NumberInput";
import dayjs from "dayjs";
import Button from "@mui/material/Button";

function SearchFilters({setFilterChanged}) {
    const [sortOrder, setSortOrder] = useState('');

    useEffect(() => {
        const savedSortOrder = localStorage.getItem("interviews_sortOrder");
        if (savedSortOrder) {
            setSortOrder(savedSortOrder);
        }

        const savedInterviews = localStorage.getItem("interviews");
        if (savedInterviews) {
            const parsedInterviews = JSON.parse(savedInterviews);
            setInputText(parsedInterviews.input)
            setType(parsedInterviews.type);
            setMinScore(parsedInterviews.minScore);
            setMaxScore(parsedInterviews.maxScore);
            setDate(parsedInterviews.date === null ? null : dayjs(parsedInterviews.date));
        }
    }, []);

    const [inputText, setInputText] = useState('');
    const [type, setType] = useState('');
    const [date, setDate] = useState(null);
    const [minScore, setMinScore] = useState(0);
    const [maxScore, setMaxScore] = useState(10);

    const saveFiltersToLocalStorage = () => {
        const interviewsObject = {
            input: inputText,
            type: type,
            date: date,
            minScore: minScore,
            maxScore: maxScore,
        };
        localStorage.setItem("interviews", JSON.stringify(interviewsObject));
    };

    const saveTypeToLocalStorage = (e) => {
        const value = e.target.value;
        setType(value);
    };

    let inputHandler = (e) => {
        let lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    const handleStartDateChange = (date) => {
        setDate(date);
    };

    const changeSortOrder = (e) => {
        const newSortOrder = e.target.value;
        localStorage.setItem("interviews_sortOrder", newSortOrder);
        setSortOrder(newSortOrder);
    }

    const [clearFilters, setClearFilters] = useState(false)

    const handleClearFilters = () => {
        setClearFilters(true)

        setInputText('')
        setType('')
        setMinScore(0)
        setMaxScore(10)
        setDate(null)
        setSortOrder('')

        localStorage.setItem("interviews_sortOrder", '');
        setSortOrder('');
        setFilterChanged((prev) => !prev)
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
            {/*<div className={styles.filter}>*/}
            {/*    <div className={styles.filterContent}>*/}
            {/*        <TextField*/}
            {/*            id="outlined-basic"*/}
            {/*            onChange={inputHandler}*/}
            {/*            variant="outlined"*/}
            {/*            label="Search"*/}
            {/*            value={inputText}*/}
            {/*        />*/}
            {/*    </div>*/}
            {/*</div>*/}
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <FormControl sx={{minWidth: 85}}>
                        <InputLabel id="type-select-label">Type</InputLabel>
                        <Select
                            autoWidth
                            labelId="type-select-label"
                            id="type-select"
                            label="Type"
                            value={type}
                            onChange={saveTypeToLocalStorage}
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
                    <DatePicker
                        label="Interview Date"
                        value={date}
                        onChange={handleStartDateChange}
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
                            <MenuItem value={'Old first'}>Old first</MenuItem>
                            <MenuItem value={'New first'}>New first</MenuItem>
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
