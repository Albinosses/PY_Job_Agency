import React, { useState } from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import styles from "./Export.module.css"
import CustomNumberInput from "../NumberInput";
import Button from "@mui/material/Button";

const Export = () => {
    const [selectedEntity, setSelectedEntity] = useState(""); // State to hold the selected entity
    const [numberOfItems, setNumberOfItems] = useState(10); // State to hold the number of items

    const handleEntitySelect = (e) => {
        setSelectedEntity(e.target.value);
    };

    const handleNumberOfItemsChange = (e, v) => {
        setNumberOfItems(v);
    };

    const handleExport = () => {
        let apiUrl = `http://127.0.0.1:8003/api/get/`

        if (selectedEntity === 'V'){
            apiUrl += 'export_vacancies'
        }
        if (selectedEntity === 'I'){
            apiUrl += 'export_interviews'
        }
        if (selectedEntity === 'H'){
            apiUrl += 'export_hires'
        }

        apiUrl += '?rows=' + numberOfItems

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                if (selectedEntity === 'V'){
                    a.download = 'vacancies.csv';
                }
                if (selectedEntity === 'I'){
                    a.download = 'interviews.csv';
                }
                if (selectedEntity === 'H'){
                    a.download = 'hires.csv';
                }
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    return (
        <div className={styles.container}>
            <div className={styles.filter}>
                <FormControl sx={{minWidth: 100}}>
                    <InputLabel id="fact-select-label">Fact</InputLabel>
                    <Select
                        autoWidth
                        labelId="fact-select-label"
                        id="fact-select"
                        label="Fact"
                        value={selectedEntity}
                        onChange={handleEntitySelect}
                    >
                        <MenuItem value={'V'}>Vacancy</MenuItem>
                        <MenuItem value={'I'}>Interview</MenuItem>
                        <MenuItem value={'H'}>Hire</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div className={styles.text}>
                <div>
                    <span>Number of items to export:</span>
                </div>
                <div>
                    <CustomNumberInput
                        sx={{width: 100}}
                        min={10}
                        value={numberOfItems}
                        onChange={handleNumberOfItemsChange}
                    />
                </div>
            </div>
            <div>
                <Button
                    variant="contained"
                    disabled={selectedEntity === ""}
                    onClick={handleExport}
                >
                    Export
                </Button>
            </div>
        </div>
    );
};

export default Export;
