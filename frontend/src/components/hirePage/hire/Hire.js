import React from "react";
import styles from "./Hire.module.css";

function Hire({hire}) {
    return (
        <div className={styles.vacancyContainer}>
            <div className={styles.vacancyHeader}>
                <div className={styles.vacancyTags}>
                    <div className={styles.vacancyTag}>Country</div>
                    <div className={styles.vacancyTag}>Company</div>
                </div>
            </div>
            <div className={styles.vacancyDate}>{hire.hireDate}</div>
            <div className={styles.vacancyLink}>Learn more</div>
        </div>
    );
}

export default Hire;
