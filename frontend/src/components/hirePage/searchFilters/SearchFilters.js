import React, {useEffect, useState} from "react";
import styles from "./SearchFilters.module.css";
import TextField from "@mui/material/TextField";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import {DatePicker} from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import dayjs from "dayjs";

function SearchFilters({setFilterChanged}) {
    const [sortOrder, setSortOrder] = useState("");

    useEffect(() => {
        const savedSortOrder = localStorage.getItem("hires_sortOrder");
        if (savedSortOrder) {
            setSortOrder(savedSortOrder);
        }

        const savedHires = localStorage.getItem("hires");
        console.log(savedHires)
        if (savedHires) {
            const parsedHires = JSON.parse(savedHires);
            setInputText(parsedHires.input)
            setDate(parsedHires.date === null ? null : dayjs(parsedHires.date));
        }
    }, []);

    const [inputText, setInputText] = useState("");
    const [date, setDate] = useState(null);

    const saveFiltersToLocalStorage = () => {
        const hiresObject = {
            date: date
        };
        localStorage.setItem("hires", JSON.stringify(hiresObject));
    };

    const handleStartDateChange = (date) => {
        setDate(date);
        console.log(date)
    };

    const changeSortOrder = (e) => {
        const newSortOrder = e.target.value;
        localStorage.setItem("hires_sortOrder", newSortOrder);
        setSortOrder(newSortOrder);
    }

    const [clearFilters, setClearFilters] = useState(false)

    const handleClearFilters = () => {
        setClearFilters(true)
        setDate(null)
        setSortOrder('')

        localStorage.setItem("hires_sortOrder", '');
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
            <div className={styles.filter}>
                <div className={styles.filterContent}>
                    <DatePicker
                        label="Hire Date"
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
                            autoWidth
                            onChange={changeSortOrder}
                            value={sortOrder}
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
