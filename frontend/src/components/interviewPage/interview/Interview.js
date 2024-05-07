import React from "react";
import styles from "./Interview.module.css";
import dayjs from "dayjs";

function Interview({interview}) {
    const getFullType = (abr) => {
        switch (abr) {
            case 'S':
                return 'Screening';
            case 'H':
                return 'HR interview';
            case 'T':
                return 'Tech interview';
            default:
                return '';
        }
    }

    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTags}>
                    <div className={styles.vacancyTag}>{getFullType(interview.interviewType)}</div>
                </div>
            </div>
            <div className={styles.vacancyDate}>{dayjs(interview.interviewDate).format('YYYY-MM-DD')}</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>

    );
}

export default Interview;
