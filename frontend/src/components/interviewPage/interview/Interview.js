import React from "react";
import styles from "./Interview.module.css";

function Interview({interview}) {
    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTags}>
                    <div className={styles.vacancyTag}>Company</div>
                </div>
            </div>
            <div className={styles.vacancyDate}>{interview.InterviewDate}</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>
    );
}

export default Interview;
