import React, {useContext} from "react";
import Hire from "../hire/Hire";
import styles from "./HireScrollable.module.css";
import {HireContext} from "../../../contexts/HireContext";
import {Link} from "react-router-dom";
import {CircularProgress} from "@mui/material";

function HireScrollable({vacancyId}) {
    const {hires} = useContext(HireContext)

    return (
        <>
            {hires.length === 0 &&
                <div className={styles.circularProgressContainer}>
                    <CircularProgress size={80} thickness={4}/>
                </div>
            }
            <div className={styles.container}>
                <div className={styles.scrollableContainer}>
                    {vacancyId ? (
                        hires
                            .filter(hire => hire.vacancyId === vacancyId)
                            .map(hire => (
                                <Link to={`/hire/${hire.id}`}>
                                    <Hire
                                        key={hire.id}
                                        hire={hire}
                                    />
                                </Link>
                            ))) : (
                        hires.map(hire => (
                            <Link to={`/hire/${hire.id}`}>
                                <Hire
                                    key={hire.id}
                                    hire={hire}
                                />
                            </Link>
                        )))}
                </div>
            </div>
        </>

    );
}

export default HireScrollable;