import React, {useContext} from "react";
import styles from "./Interview.module.css";
import {GeneralContext} from "../../../contexts/GeneralContext";
import dayjs from "dayjs";

function Interview({interview}) {
    const {countries, companies} = useContext(GeneralContext)

    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTags}>
                    <div className={styles.vacancyTag}>Company</div>
                </div>
            </div>
            <div className={styles.vacancyDate}>{dayjs(interview.InterviewDate).format('YYYY-MM-DD')}</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>

    );
}

export default Interview;
