import React from "react";
import styles from "./Interview.module.css";

function Interview() {
    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTags}>
                    <div className={styles.vacancyTag}>Company</div>
                </div>
            </div>
            <div className={styles.vacancyDate}>01 Feb 2024</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>
    );
}

export default Interview;
