import React, {useContext, useEffect, useState} from "react";
import styles from "./SearchFilters.module.css";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import CustomNumberInput from "../../NumberInput";
import {InterviewContext} from "../../../contexts/InterviewContext";
import dayjs from "dayjs";
import Button from "@mui/material/Button";

function SearchFilters() {
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

    const saveMinScoreToLocalStorage = (e, v) => {
        setMinScore(v);
    };

    const saveMaxScoreToLocalStorage = (e, v) => {
        setMaxScore(v);
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
    }

    useEffect(() => {
        if(clearFilters){
            saveFiltersToLocalStorage();
            setClearFilters(false)
        }
    }, [clearFilters]);

    const handleApplyFilters = () => {
        saveFiltersToLocalStorage()
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
            <div>
                <div className={styles.minScoreContainer}>
                    <span>Min-score:</span>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <CustomNumberInput
                        sx={{width: 62}}
                        value={minScore}
                        min={0}
                        max={maxScore}
                        onChange={saveMinScoreToLocalStorage}
                    />
                </div>
            </div>
            <div>
                <div className={styles.minScoreContainer}>
                    <span>Max-score:</span>
                </div>
            </div>
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <CustomNumberInput
                        sx={{width: 62}}
                        value={maxScore}
                        min={minScore}
                        max={10}
                        onChange={saveMaxScoreToLocalStorage}
                    />
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
                            <MenuItem value={'old_first'}>Old first</MenuItem>
                            <MenuItem value={'new_first'}>New first</MenuItem>
                            <MenuItem value={'long_first'}>Long first </MenuItem>
                            <MenuItem value={'short_first'}>Short first </MenuItem>
                            <MenuItem value={'big_score_first'}>Big score first </MenuItem>
                            <MenuItem value={'small_score_first'}>Small score first </MenuItem>
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
