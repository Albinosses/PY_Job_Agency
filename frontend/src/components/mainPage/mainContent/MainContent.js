import {styled} from '@mui/material/styles';
import Button from "@mui/material/Button";
import {Chip} from "@mui/material";
import styles from "./MainContent.module.css"
import React, {useState} from "react";
import {CircularProgress} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function MainContent() {
    const [uploadedFile, setUploadedFile] = useState()
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const fileName = file.name;
            const fileType = file.type;
            if (fileType === 'text/csv') {
                setUploadedFile(file)
                console.log('CSV file selected:', fileName);
            } else {
                alert('Please select a CSV file.');
            }
        }
    };

    const [dbIsBeingInitialized, setDbIsBeingInitialized] = useState(false)
    const [dbIsInitialized, setDbIsInitialized] = useState(false)
    const [incrementalEtlIsRun, setIncrementalEtlIsRun] = useState(false)
    const [incrementalEtlIsDone, setIncrementalEtlIsDone] = useState(false)

    const handleRunDbsInit = (event) => {
        setDbIsInitialized(false)
        setDbIsBeingInitialized(true)

        setTimeout(function () {
            setDbIsBeingInitialized(false)
            setDbIsInitialized(true)
        }, 5000)
    }

    const handleRunIncrementalEtl = (event) => {
        setIncrementalEtlIsDone(false)
        setIncrementalEtlIsRun(true)

        setTimeout(function () {
            setIncrementalEtlIsRun(false)
            setIncrementalEtlIsDone(true)
        }, 5000)
    }

    return (
        <div className={styles.container}>
            {/*<div className={styles.buttonContainer}>*/}
            {/*    <Button*/}
            {/*        component="label"*/}
            {/*        role={undefined}*/}
            {/*        variant="contained"*/}
            {/*        tabIndex={-1}*/}
            {/*        size="large"*/}
            {/*    >*/}
            {/*        Upload file*/}
            {/*        <VisuallyHiddenInput type="file" accept='.csv' onChange={handleFileUpload}/>*/}
            {/*    </Button>*/}
            {/*    {uploadedFile ?*/}
            {/*        <Chip label={uploadedFile.name}/> :*/}
            {/*        <Chip label="predefined dataset"/>*/}
            {/*    }*/}
            {/*</div>*/}
            {/*<div className={styles.buttonContainer}>*/}
            {/*    <Button*/}
            {/*        variant="contained"*/}
            {/*        onClick={handleRunDbsInit}*/}
            {/*        size="large"*/}
            {/*    >*/}
            {/*        Initialize Databases*/}
            {/*    </Button>*/}
            {/*    {dbIsBeingInitialized && <CircularProgress/>}*/}
            {/*    {dbIsInitialized && <CheckIcon/>}*/}
            {/*</div>*/}
            <div className={styles.buttonContainer}>
                <Button
                    variant="contained"
                    onClick={handleRunIncrementalEtl}
                    size="large"
                >
                    Run Incremental ETL
                </Button>
                {incrementalEtlIsRun && <CircularProgress/>}
                {incrementalEtlIsDone && <CheckIcon/>}
            </div>
        </div>
    );
}

export default MainContent