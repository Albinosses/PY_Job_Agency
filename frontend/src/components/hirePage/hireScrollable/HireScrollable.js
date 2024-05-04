import React, {useContext, useEffect} from "react";
import Hire from "../hire/Hire";
import styles from "./HireScrollable.module.css";
import {HireContext} from "../../../contexts/HireContext";
import {Link} from "react-router-dom";
import {CircularProgress} from "@mui/material";

function HireScrollable({hiresObj}) {
    const {hires, setHires, setCurrentHire} = useContext(HireContext)

    useEffect(() => {
        setCurrentHire(undefined)
        if(!hiresObj || Object.keys(hiresObj).length === 0){
            fetch('http://127.0.0.1:8003/api/get/hires?page=1')
                .then(response => response.json())
                .then(data => {setHires(data.hires)} )
                .catch(err => console.log(err))
        }
    }, [hiresObj, setHires]);

    return (
        <>
            {( !hires || hires.length === 0) &&
                <div className={styles.circularProgressContainer}>
                    <CircularProgress size={80} thickness={4}/>
                </div>
            }
            {(hires || hiresObj) &&
                <div className={styles.container}>
                    <div className={styles.scrollableContainer}>
                        {hiresObj ? (
                            hiresObj
                                .map(hire => (
                                    <Link to={`/hire/${hire.id}`} onClick={() => setCurrentHire(hire)}>
                                        <Hire
                                            key={hire.id}
                                            hire={hire}
                                        />
                                    </Link>
                                ))) : (
                            hires.map(hire => (
                                <Link to={`/hire/${hire.id}`} onClick={() => setCurrentHire(hire)}>
                                    <Hire
                                        key={hire.id}
                                        hire={hire}
                                    />
                                </Link>
                            )))}
                    </div>
                </div>
            }
        </>

    );
}

export default HireScrollable;